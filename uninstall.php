<?php
/**
 * Uninstall script for DeepL Translate plugin
 *
 * @package DeepL Translate
 */

// Exit if accessed directly.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Delete the API key option
delete_option( 'deepl_api_key_option' );

// Delete the menu page (if it exists)
global $wp_menu;
$deepl_menu_slug = 'deepl-api-key-settings';

foreach ( $wp_menu as $key => $menu_item ) {
	if ( isset( $menu_item[2] ) && $menu_item[2] === $deepl_menu_slug ) {
		unset( $wp_menu[ $key ] );
		break;
	}
}
