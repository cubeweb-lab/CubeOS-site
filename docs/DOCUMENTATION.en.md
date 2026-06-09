# CubeOS Documentation

CubeOS is a 64-bit operating system written in Rust.  
The project is created for learning low-level programming and OS architecture.

---

## Table of Contents

1. [System Versions](#system-versions)
2. [How to Run](#how-to-run)
3. [Building from Source](#building-from-source)
4. [Architecture](#architecture)
5. [Terminal Commands](#terminal-commands)
6. [Terminal Themes](#terminal-themes)
7. [File System](#file-system)
8. [Known Issues](#known-issues)

---

## System Versions

### CubeOS (Main)
The main branch with a graphical user interface.

**Features:**
- Window manager (drag, minimize, close)
- Taskbar and Start menu
- Desktop wallpapers (BMP, solid colors)
- Visual themes (Warm, Classic, Cool, Vista)
- Graphical file manager
- Built-in terminal with color themes
- Settings window (Display, Appearance, About)
- Calculator

**Minimum requirements:**
- RAM: 19 MB
- CPU: x86_64, ~100 MHz
- Graphics: VESA 800×600×32

### CubeOS Legacy
Terminal version in VESA mode.

**Features:**
- Full-featured terminal with command history
- FAT32 support (read, write, create, delete)
- Color themes (Classic, Matrix, Mint, Peach, Surprise, and more)
- ACPI shutdown
- 104-key keyboard with Shift support

**Minimum requirements:**
- RAM: ~8 MB
- CPU: x86_64, ~50 MHz
- Graphics: VESA 800×600×32

---

## How to Run

### Requirements
- QEMU 6.0 or newer
- FAT32 disk image (optional, for file operations)

### Running CubeOS (Main)
```bash
qemu-system-x86_64 -cdrom cubeos.iso -m 1024M -vga vmware -no-reboot -no-shutdown
```

With a disk image:
```bash
qemu-system-x86_64 -cdrom cubeos.iso -hda fat32.img -m 1024M -vga vmware -no-reboot -no-shutdown -boot d
```

### Running CubeOS Legacy
```bash
qemu-system-x86_64 -cdrom cubeos-legacy.iso -m 1024M -no-reboot -no-shutdown
```

With a disk image:
```bash
qemu-system-x86_64 -cdrom cubeos-legacy.iso -drive file=fat32.img,format=raw,cache=unsafe -m 1024M -no-reboot -no-shutdown -boot d
```

### Creating a FAT32 image
```bash
dd if=/dev/zero of=fat32.img bs=1M count=64
mkfs.fat -F 32 fat32.img
```

---

## Building from Source

> **Note:** the source code is currently private.  
> This guide will be available after the repository is opened.

### Build Requirements
- Rust nightly
- NASM
- GCC (for C file compilation)
- ld.lld (linker)
- grub-mkrescue (for ISO creation)
- mtools (for FAT image handling)

### Build
```bash
git clone https://github.com/cubeweb-lab/cubeos.git
cd cubeos
make setup
make
```

### Run
```bash
make run
```

---

## Architecture

### Boot Process
1. GRUB loads the kernel (multiboot2)
2. `boot.asm` sets up Long Mode, paging, GDT, TSS
3. Jumps to `rust_main`

### Kernel (CubeOS Main)
- **Graphics:** VESA framebuffer via multiboot2
- **Windows:** custom window manager
- **Memory:** direct framebuffer access, double buffering
- **Interrupts:** IDT, exception handlers, BSOD/GSOD
- **Devices:** PS/2 mouse, keyboard, ATA

### Kernel (CubeOS Legacy)
- **Terminal:** direct VESA framebuffer output
- **Buffer:** keyboard ring buffer
- **ATA:** PIO mode, spinlock for port protection
- **ACPI:** shutdown via port 0x604

### File System
- **Type:** FAT32
- **Driver:** custom, written in Rust
- **Support:** read/write, create/delete files and folders
- **Notes:** works with RAM disk and real ATA

---

## Terminal Commands

### General Commands
| Command | Description |
|---------|-------------|
| `help` | Show command list |
| `ver` | System version |
| `mem` | Memory information |
| `uptime` | Uptime in ticks |
| `cls` / `clear` | Clear screen |
| `dice` | Roll a dice |
| `about` | About the system |
| `cubefetch` | System information (like neofetch) |

### File Commands (when a disk is mounted)
| Command | Description |
|---------|-------------|
| `dir` | List files and folders |
| `cd <folder>` | Change directory |
| `read <file>` | Read file contents |
| `write <file>` | Write text to file |
| `mkdir <name>` | Create folder |
| `del <file>` | Delete file |

### System Commands
| Command | Description |
|---------|-------------|
| `theme <name>` | Change terminal theme |
| `shutdown` | Power off (ACPI, Legacy only) |
| `crash <0-31>` | Trigger exception (BSOD testing) |

---

## Terminal Themes

Themes can be changed with the `theme <name>` command.

### Available in CubeOS (Main)
| Theme | Background | Text |
|-------|-----------|------|
| `Classic` | Dark gray | Light gray |
| `Black & White` | Black | White |
| `Mint` | Mint green | White smoke |
| `Peach` | Peach | Royal blue |
| `Burnt Orange` | Burnt orange | Warm beige |
| `Cherry Red` | Cherry red | Off white |
| `Charcoal & Yellow` | Charcoal | Yellow |
| `Cyberpunk` | Deep purple | Neon cyan |
| `Forest` | Dark green | Light green |
| `Matrix` | Black | Green |
| `Surprise` | Blue | White |

### Available in CubeOS Legacy
| Theme | Background | Text |
|-------|-----------|------|
| `Classic` | Dark gray | Light gray |
| `Black & White` | Black | White |
| `Mint` | Mint green | White smoke |
| `Peach` | Peach | Royal blue |
| `Burnt Orange` | Burnt orange | Warm beige |
| `Matrix` | Black | Green |
| `Surprise` | Blue | White |

---

## File System

CubeOS uses FAT32 as the primary file system.

### Supported Operations
- File reading
- File writing (limited to one cluster)
- File and folder creation
- File deletion
- Directory navigation

### Limitations
- Long File Names (LFN) are not supported
- File size is limited to cluster size (usually 512-4096 bytes)
- Fragmentation is not handled
- Only FAT32, no FAT16/FAT12/exFAT support

### Write Caching
When using QEMU with `-hda fat32.img`, changes may not be saved to disk due to QEMU write caching. Use `-drive file=fat32.img,format=raw,cache=unsafe` for immediate writes.

---

## Known Issues

### CubeOS (Main)
- ATA driver may cause Triple Fault during initialization on some configurations
- Mouse interrupts require PIC remapping
- GUI stack may overflow during extended use
- Tamzen 8×16 font does not support Cyrillic

### CubeOS Legacy
- No LFN (Long File Names) support
- No mouse support
- ACPI shutdown only works in QEMU (port 0x604)
- `write` command writes a hardcoded test string only

### Common
- No network support
- No audio
- x86_64 architecture only
- No USB support
- No multitasking (cooperative only)

---

## License

Source code is currently private. Binary builds are distributed for free.

---

## Contacts

- Developer: CubeDev
- GitHub: [cubeweb-lab](https://github.com/cubeweb-lab)

---

*Documentation updated: June 2026*
