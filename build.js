const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const JavaScriptObfuscator = require('javascript-obfuscator');
require('dotenv').config();

const CONFIG = {
    srcDir: '.',
    jsDir: 'js',
    outputDir: 'dist',
    filesToProcess: [
        'scripts.js',
        'js/app.js',
        'js/api.js',
        'js/auth.js',
        'js/config.js',
        'js/state.js',
        'js/ui.js',
        'js/utils.js',
        'js/security.js'
    ],
    placeholder: '__SHEET_API_URL_PLACEHOLDER__',
    envKey: 'SHEET_API_URL'
};

async function build() {
    console.log('🚀 Starting ListV Security Build...');

    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir);
        fs.mkdirSync(path.join(CONFIG.outputDir, 'js'));
        fs.mkdirSync(path.join(CONFIG.outputDir, 'css'));
        fs.mkdirSync(path.join(CONFIG.outputDir, 'components'));
    }

    // 1. Process JS Files
    for (const relPath of CONFIG.filesToProcess) {
        let content = fs.readFileSync(path.join(CONFIG.srcDir, relPath), 'utf8');

        // Inject Secrets
        if (relPath === 'js/config.js') {
            console.log(`🔑 Injecting secret into ${relPath}...`);
            content = content.replace(CONFIG.placeholder, process.env[CONFIG.envKey]);
        }

        console.log(`📦 Minifying & Obfuscating ${relPath}...`);

        // Minify
        const minified = await minify(content, {
            compress: true,
            mangle: true,
            module: true // Handle ES Modules correctly
        });

        // Obfuscate
        const obfuscated = JavaScriptObfuscator.obfuscate(minified.code, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: true,
            debugProtectionInterval: 2000,
            disableConsoleOutput: false, // Re-enable for debugging blank page
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            numbersToExpressions: true,
            renameGlobals: false, // Set to true for even more security, but might break modules
            selfDefending: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayCallsTransform: true,
            stringArrayEncoding: ['base64'],
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: false
        });

        const outputPath = path.join(CONFIG.outputDir, relPath);
        fs.writeFileSync(outputPath, obfuscated.getObfuscatedCode());
    }

    // 2. Copy CSS, HTML, and Components (Static assets)
    console.log('📂 Copying assets...');

    // Copy HTML
    const htmlFiles = ['index.html', 'dashboard.html'];
    htmlFiles.forEach(sub => {
        let content = fs.readFileSync(path.join(CONFIG.srcDir, sub), 'utf8');
        fs.writeFileSync(path.join(CONFIG.outputDir, sub), content);
    });

    // Copy CSS
    const cssFiles = fs.readdirSync(path.join(CONFIG.srcDir, 'css'));
    cssFiles.forEach(file => {
        const content = fs.readFileSync(path.join(CONFIG.srcDir, 'css', file), 'utf8');
        fs.writeFileSync(path.join(CONFIG.outputDir, 'css', file), content);
    });

    // Copy Components
    const compFiles = fs.readdirSync(path.join(CONFIG.srcDir, 'components'));
    compFiles.forEach(file => {
        const content = fs.readFileSync(path.join(CONFIG.srcDir, 'components', file), 'utf8');
        fs.writeFileSync(path.join(CONFIG.outputDir, 'components', file), content);
    });

    // Copy remaining root assets
    const rootStyles = 'styles.css';
    if (fs.existsSync(rootStyles)) {
        fs.writeFileSync(path.join(CONFIG.outputDir, rootStyles), fs.readFileSync(rootStyles));
    }

    console.log('✅ Build Complete! Secure version is in the "dist" folder.');
}

build().catch(err => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});
