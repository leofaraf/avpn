// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, Stdio};

use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem, SystemTray};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn current_ip() -> String {
    let output = Command::new("sh")
        .args(["scripts/current_ip.sh"])
        .stdout(Stdio::piped())
        .output()
        .expect("script error");
    String::from_utf8(output.stdout).unwrap()
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide);
    
    let tray = SystemTray::new()
        .with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(tray)
        .invoke_handler(tauri::generate_handler![greet, current_ip])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
