// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{process::{Command, Stdio}, sync::Arc, fs::{File, self}, time::Instant, path::PathBuf};

use serde::Serialize;
use tauri::{AppHandle, http::header, App, Manager, Window};
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem, SystemTray};

#[derive(Debug, Serialize)]
struct Profile {
    country: String,
    query: String 
}

fn resource_path(handle: &AppHandle) -> PathBuf {
    let path = handle.path_resolver()
        .app_data_dir().unwrap();
    fs::create_dir_all(&path).unwrap();
    path
}

#[tauri::command]
fn ip() -> String {
    let output = Command::new("sh")
        .args(["scripts/current_ip.sh"])
        .stdout(Stdio::piped())
        .output()
        .expect("script error");
    String::from_utf8(output.stdout).unwrap()
}

fn profile(handle: AppHandle) -> Option<String> {
    let path = resource_path(&handle);
    File::create(path.join("config.json")).unwrap();
    Some("dsfds".into())
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
        .invoke_handler(tauri::generate_handler![ip])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
