# DeepL Translate WordPress Plugin

A WordPress plugin that integrates with the DeepL translation API to provide translation capabilities for posts and pages.

## Description

This plugin allows WordPress users to translate their posts and pages using the DeepL translation API. It provides a user-friendly interface in the WordPress admin to manage API keys and translate content directly from the post editor.

## Features

- Admin settings page for managing DeepL API key
- Translation meta box in post editor
- REST API endpoint for translation requests
- Support for multiple languages
- Error handling for API issues

## Requirements

- WordPress 5.0 or higher
- PHP 7.0 or higher
- DeepL API key (available at [https://www.deepl.com/pro](https://www.deepl.com/pro))

## Installation

1. Download the plugin files
2. Upload the plugin folder to the `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Go to Settings → DeepL Translate to enter your API key

## Usage

1. After activating the plugin, navigate to Settings → DeepL Translate to enter your DeepL API key
2. Edit any post or page
3. In the sidebar, you'll see a "Translate Post" meta box
4. Click the "Translate" button to translate the content to the target language

## API Key Setup

1. Go to [https://www.deepl.com/pro](https://www.deepl.com/pro) to get your API key
2. In WordPress admin, go to Settings → DeepL Translate
3. Paste your API key in the input field and save changes
