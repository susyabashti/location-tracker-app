.PHONY: help install clean pods install-pods update-pods build-android build-ios run-android run-ios test lint run-dev

# Show available commands
help:
	@echo "Available commands:"
	@echo "  install     - Install all dependencies"
	@echo "  clean       - Clean project builds"
	@echo "  pods        - Install iOS pods"
	@echo "  install-pods - Install iOS pods (alias for pods)"
	@echo "  update-pods   - Update iOS pods"
	@echo "  build-android - Build Android app"
	@echo "  build-ios     - Build iOS app"
	@echo "  run-android   - Run Android app"
	@echo "  run-ios       - Run iOS app"
	@echo "  lint          - Run linter"
	@echo "  run-dev       - Start Metro server with cache reset"

# Install all dependencies
install: install-node install-pods

# Clean project builds
clean-all: clean-node clean-ios clean-android

# Clean Node modules
clean-node:
	rm -rf node_modules
	@echo "Cleaned node_modules"

# Clean iOS build artifacts
clean-ios:
	rm -rf ios/Pods
	rm -rf ios/build
	@echo "Cleaned iOS"

# Clean Android build artifacts
clean-android:
	rm -rf android/.gradle
	rm -rf android/app/build
	@echo "Cleaned Android"

# Install iOS pods
pods:
	@echo "Installing iOS pods..."
	cd ios && pod install
	@echo "iOS pods installed"

# Install iOS pods (alias)
install-pods: pods

# Update iOS pods
update-pods:
	@echo "Updating iOS pods..."
	cd ios && pod update
	@echo "iOS pods updated"

# Build Android app
build-android:
	@echo "Building Android app..."
	npx react-native build-android
	@echo "Android build complete"

# Build iOS app
build-ios:
	@echo "Building iOS app..."
	npx react-native build-ios
	@echo "iOS build complete"

# Run Android app
run-android:
	@echo "Running Android app..."
	npx react-native run-android
	@echo "Android app running"

# Run iOS app
run-ios:
	@echo "Running iOS app..."
	npx react-native run-ios
	@echo "iOS app running"

# Start with reset cache
run-dev:
	@echo "Starting Metro server with cache reset..."
	npx react-native start --reset-cache

# Run linter
lint:
	@echo "Running linter..."
	npx eslint . --ext .js,.jsx,.ts,.tsx
	@echo "Linting complete"

# Install Node dependencies
install-node:
	@echo "Installing Node dependencies..."
	npm install
	@echo "Node dependencies installed"

xcode:
	cd ios && xed .