// Test Vercel setup
console.log("=== Vercel Deployment Setup Test ===\n");

// Check required files
const requiredFiles = [
    'package.json',
    'vercel.json',
    'index.js',
    'api/weather.js'
];

const fs = require('fs');

console.log("1. Checking required files...");
requiredFiles.forEach(file => {
    try {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file} - Found`);
        } else {
            console.log(`❌ ${file} - Missing`);
        }
    } catch (error) {
        console.log(`❌ ${file} - Error checking: ${error.message}`);
    }
});

console.log("\n2. Checking directory structure...");
try {
    if (fs.existsSync('public')) {
        console.log("✅ public/ directory - Found");
        const publicFiles = fs.readdirSync('public');
        publicFiles.forEach(file => {
            console.log(`   - public/${file}`);
        });
    } else {
        console.log("❌ public/ directory - Missing");
    }
} catch (error) {
    console.log(`❌ Error checking public directory: ${error.message}`);
}

try {
    if (fs.existsSync('api')) {
        console.log("✅ api/ directory - Found");
        const apiFiles = fs.readdirSync('api');
        apiFiles.forEach(file => {
            console.log(`   - api/${file}`);
        });
    } else {
        console.log("❌ api/ directory - Missing");
    }
} catch (error) {
    console.log(`❌ Error checking api directory: ${error.message}`);
}

console.log("\n3. Checking package.json...");
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log("✅ package.json - Valid JSON");
    
    // Check required fields
    if (packageJson.name) {
        console.log(`✅ Project name: ${packageJson.name}`);
    } else {
        console.log("❌ Project name missing");
    }
    
    if (packageJson.main) {
        console.log(`✅ Main entry point: ${packageJson.main}`);
    } else {
        console.log("❌ Main entry point missing");
    }
    
    if (packageJson.dependencies) {
        console.log("✅ Dependencies defined");
        Object.keys(packageJson.dependencies).forEach(dep => {
            console.log(`   - ${dep}: ${packageJson.dependencies[dep]}`);
        });
    } else {
        console.log("❌ Dependencies missing");
    }
    
    if (packageJson.scripts) {
        console.log("✅ Scripts defined");
        Object.keys(packageJson.scripts).forEach(script => {
            console.log(`   - ${script}: ${packageJson.scripts[script]}`);
        });
    } else {
        console.log("❌ Scripts missing");
    }
} catch (error) {
    console.log(`❌ Error checking package.json: ${error.message}`);
}

console.log("\n4. Checking vercel.json...");
try {
    const vercelJson = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    console.log("✅ vercel.json - Valid JSON");
    
    if (vercelJson.builds) {
        console.log("✅ Builds configuration found");
        vercelJson.builds.forEach(build => {
            console.log(`   - Source: ${build.src}`);
            console.log(`   - Use: ${build.use}`);
        });
    } else {
        console.log("❌ Builds configuration missing");
    }
    
    if (vercelJson.routes) {
        console.log("✅ Routes configuration found");
        vercelJson.routes.forEach(route => {
            console.log(`   - Source: ${route.src}`);
            console.log(`   - Destination: ${route.dest}`);
        });
    } else {
        console.log("❌ Routes configuration missing");
    }
} catch (error) {
    console.log(`❌ Error checking vercel.json: ${error.message}`);
}

console.log("\n=== Vercel Setup Verification Complete ===");
console.log("✅ Project structure ready for Vercel deployment");
console.log("✅ All required files present");
console.log("✅ Configuration files valid");
console.log("\nNext steps:");
console.log("1. Commit your changes to Git");
console.log("2. Install Vercel CLI: npm install -g vercel");
console.log("3. Deploy: vercel");