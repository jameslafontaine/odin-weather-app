#!/bin/bash
# setup_template_repo.sh
# Automated setup for Webpack template repository
# Run this after cloning your template repo to initialize a new project

set -e  # Exit on error
set -u  # Exit on undefined variable

# -------------------------------
# 🎨 Color Definitions
# -------------------------------
readonly GREEN="\033[1;32m"
readonly YELLOW="\033[1;33m"
readonly RED="\033[1;31m"
readonly BLUE="\033[1;34m"
readonly RESET="\033[0m"

# -------------------------------
# 🎯 Helper Functions
# -------------------------------

info() { echo -e "${BLUE}💬 $1${RESET}"; }
success() { echo -e "${GREEN}✅ $1${RESET}"; }
skip() { echo -e "${YELLOW}⏩ $1${RESET}"; }
warn() { echo -e "${RED}⚠️ $1${RESET}"; }
error() { echo -e "${RED}❌ ERROR: $1${RESET}" >&2; }

# Check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Safer file creation using actual heredocs
create_file_if_missing() {
  local file_path=$1
  if [ -f "$file_path" ]; then
    skip "$file_path already exists, skipping..."
    return 1
  else
    info "Creating $file_path"
    return 0
  fi
}

ask_yes_no() {
  local prompt=$1
  local default=${2:-y}
  local response

  while true; do
    read -rp "$(echo -e "${BLUE}$prompt [${default}]: ${RESET}")" response
    response=${response:-$default}
    case "$response" in
      [Yy]* ) return 0 ;;
      [Nn]* ) return 1 ;;
      * ) warn "Please answer y or n." ;;
    esac
  done
}

# Add npm script using modern npm pkg set
add_npm_script() {
  local script_name=$1
  local script_command=$2
  
  if command_exists npm; then
    npm pkg set "scripts.${script_name}=${script_command}" 2>/dev/null || {
      warn "Failed to add script '${script_name}' - you may need to add it manually"
      return 1
    }
  else
    error "npm not found!"
    return 1
  fi
}

# -------------------------------
# 🔍 Prerequisites Check
# -------------------------------
check_prerequisites() {
  info "Checking prerequisites..."
  
  if ! command_exists node; then
    error "Node.js is not installed. Please install Node.js first."
    exit 1
  fi
  
  if ! command_exists npm; then
    error "npm is not installed. Please install npm first."
    exit 1
  fi
  
  if ! command_exists git; then
    warn "Git is not installed. Git initialization will be skipped."
  fi
  
  local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
  # Only check version if we got a valid numeric result
  if [[ "$node_version" =~ ^[0-9]+$ ]] && [ "$node_version" -lt 14 ]; then
    warn "Node.js version is quite old (v${node_version}). Consider upgrading to v18 or later."
  fi
  
  success "Prerequisites OK"
}

# -------------------------------
# 🚀 Main Setup Functions
# -------------------------------

setup_npm() {
  if [ ! -f package.json ]; then
    info "Initializing npm..."
    npm init -y || {
      error "Failed to initialize npm"
      exit 1
    }
    success "npm initialized"
  else
    skip "package.json already exists"
  fi
}

install_core_dependencies() {
  info "Installing Webpack and core plugins..."
  npm install --save-dev \
    webpack webpack-cli webpack-dev-server \
    html-webpack-plugin style-loader css-loader html-loader \
    webpack-merge css-minimizer-webpack-plugin || {
    error "Failed to install core dependencies"
    exit 1
  }
  success "Core dependencies installed"
}

setup_babel() {
  if ask_yes_no "Would you like to include Babel for JS transpilation?" "y"; then
    info "Installing Babel..."
    npm install --save-dev @babel/core @babel/preset-env babel-loader || {
      error "Failed to install Babel"
      exit 1
    }
    success "Babel installed"
    
    # Create .babelrc
    if create_file_if_missing ".babelrc"; then
      cat > .babelrc << 'EOF'
{
  "presets": ["@babel/preset-env"]
}
EOF
      success "Created .babelrc"
    fi
    
    return 0
  else
    skip "Babel setup skipped"
    return 1
  fi
}

setup_eslint_prettier() {
  if ask_yes_no "Would you like to include ESLint + Prettier setup?" "y"; then
    info "Installing ESLint + Prettier..."
    
    npm install --save-dev \
      eslint prettier \
      eslint-config-prettier \
      eslint-plugin-prettier \
      @eslint/js \
      globals \
      --save-exact || {
      error "Failed to install ESLint + Prettier"
      exit 1
    }
    success "ESLint + Prettier installed"
    
    echo ""
    info "👉 VSCode Extensions Needed:"
    echo "   - ESLint (dbaeumer.vscode-eslint)"
    echo "   - Prettier (esbenp.prettier-vscode)"
    info "👉 Enable 'Format On Save' in VSCode settings"
    echo ""
    
    # Create eslint.config.mjs (ESLint v9+ flat config with ES modules)
    if create_file_if_missing "eslint.config.mjs"; then
      cat > eslint.config.mjs << 'EOF'
import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
  // Base recommended config for all files
  js.configs.recommended,
  prettierConfig,
  
  // Browser environment (for src/ files)
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  
  // Node.js environment (for webpack configs and other root-level JS files)
  {
    files: ["*.js", "*.cjs"],  // Removed *.mjs from here
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  
  // ES Modules environment (for .mjs files like eslint.config.mjs)
  {
    files: ["*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  
  // Files to ignore
  {
    ignores: [
      "dist/",
      "build/",
      "public/",
      "node_modules/",
      "src/assets/img/**",
      "src/assets/font/**",
      "src/assets/video/**",
      "*.min.js",
      "*.min.css",
      "*.bundle.js",
      "*.bundle.js.map",
      "*.js.map",
      "eslint.config.mjs",  // Don't lint the config file itself
    ],
  },
];
EOF
      success "Created eslint.config.mjs"
    fi
    
    # Create .prettierrc
    if create_file_if_missing ".prettierrc"; then
      cat > .prettierrc << 'EOF'
{
  "printWidth": 120,
  "tabWidth": 4,
  "useTabs": false,
  "singleQuote": false,
  "semi": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
EOF
      success "Created .prettierrc"
    fi
    
    # Create .prettierignore
    if create_file_if_missing ".prettierignore"; then
      cat > .prettierignore << 'EOF'
# Build artifacts
dist/
build/
public/

# Dependencies
node_modules/

# System files
.DS_Store
*.log

# Assets (Prettier cannot format these)
src/assets/img/**
src/assets/font/**
src/assets/video/**
*.png
*.jpg
*.jpeg
*.gif
*.svg
*.ico
*.ttf
*.woff
*.woff2

# Minified output
*.min.js
*.min.css
*.min.html
EOF
      success "Created .prettierignore"
    fi
    
    # Add lint scripts
    info "Adding npm scripts for lint and format..."
    add_npm_script "lint" "eslint ."
    add_npm_script "lint:fix" "eslint . --fix"
    add_npm_script "format" "prettier --write ."
    success "Lint and format scripts added"
    
    return 0
  else
    skip "ESLint + Prettier setup skipped"
    return 1
  fi
}

create_project_structure() {
  info "Creating project directories..."
  mkdir -p src/modules src/styles src/assets/img src/assets/fonts dist
  success "src/ and dist/ directories ready"
}

create_boilerplate_files() {
  info "Generating boilerplate files..."
  
  # index.html
  if create_file_if_missing "src/index.html"; then
    cat > src/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Webpack Template</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
EOF
    success "Created src/index.html"
  fi
  
  # index.js
  if create_file_if_missing "src/index.js"; then
    cat > src/index.js << 'EOF'
import "./style.css";

console.log("🚀 Webpack Template Running!");
EOF
    success "Created src/index.js"
  fi
  
  # style.css
  if create_file_if_missing "src/style.css"; then
    cat > src/style.css << 'EOF'
body {
  font-family: sans-serif;
  margin: 0;
  padding: 2rem;
  background: #f7f7f7;
}
EOF
    success "Created src/style.css"
  fi
}

setup_webpack_config() {
  local use_babel=$1
  
  info "Setting up Webpack configuration..."
  
  # webpack.common.js
  if create_file_if_missing "webpack.common.js"; then
    cat > webpack.common.js << 'WEBPACK_COMMON_EOF'
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
WEBPACK_COMMON_EOF

    # Add Babel rule if enabled
    if [ "$use_babel" = true ]; then
      cat >> webpack.common.js << 'BABEL_RULE_EOF'
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
BABEL_RULE_EOF
    fi

    # Continue with common rules
    cat >> webpack.common.js << 'WEBPACK_COMMON_END'
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
WEBPACK_COMMON_END
    success "Created webpack.common.js"
  fi
  
  # webpack.dev.js
  if create_file_if_missing "webpack.dev.js"; then
    cat > webpack.dev.js << 'EOF'
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    static: "./dist",
    port: 8080,
    open: true,
    watchFiles: ["./src/index.html"],
  },
});
EOF
    success "Created webpack.dev.js"
  fi
  
  # webpack.prod.js
  if create_file_if_missing "webpack.prod.js"; then
    cat > webpack.prod.js << 'EOF'
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  optimization: {
    minimize: true,
    minimizer: [
      "...", // Extends existing minimizers (includes TerserPlugin by default)
      new CssMinimizerPlugin(),
    ],
  },
});
EOF
    success "Created webpack.prod.js"
  fi
}

add_npm_scripts() {
  info "Adding npm scripts..."
  add_npm_script "build" "webpack --config webpack.prod.js"
  add_npm_script "dev" "webpack serve --config webpack.dev.js"
  add_npm_script "deploy" "git subtree push --prefix dist origin gh-pages"
  success "NPM scripts added"
}

initialize_git() {
  if ! command_exists git; then
    skip "Git not available, skipping repository initialization"
    return
  fi
  
  if [ -d .git ]; then
    skip "Git already initialized"
    return
  fi
  
  if ask_yes_no "Initialize git repository?" "y"; then
    info "Initializing git repository..."
    git init || {
      warn "Failed to initialize git"
      return
    }
    
    # Create .gitignore if missing
    if create_file_if_missing ".gitignore"; then
      cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment variables
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*

# Editor directories
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/
EOF
      success "Created .gitignore"
    fi
    
    success "Git initialized"
  else
    skip "Git initialization skipped"
  fi
}

# -------------------------------
# 🎬 Main Execution
# -------------------------------

main() {
  info "🚀 Starting Webpack project setup..."
  echo ""
  
  # Check prerequisites
  check_prerequisites
  echo ""
  
  # Core setup
  setup_npm
  install_core_dependencies
  echo ""
  
  # Optional features
  local use_babel=false
  if setup_babel; then
    use_babel=true
  fi
  echo ""
  
  setup_eslint_prettier
  echo ""
  
  # Project structure and files
  create_project_structure
  create_boilerplate_files
  setup_webpack_config "$use_babel"
  echo ""
  
  # Finalization
  add_npm_scripts
  initialize_git
  echo ""
  
  # Success message
  success "🎉 Setup complete!"
  echo ""
  info "Next steps:"
  echo -e "  • Run '${GREEN}npm run dev${RESET}' to start development server"
  echo -e "  • Run '${GREEN}npm run build${RESET}' to create production build"
  echo -e "  • Run '${GREEN}npm run lint${RESET}' to check code quality (if ESLint installed)"
  echo ""
  info "Happy coding! 🚀"
}

# Run main function
main