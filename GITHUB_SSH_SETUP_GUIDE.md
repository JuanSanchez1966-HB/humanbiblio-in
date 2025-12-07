# 🔐 GUÍA: SUBIR CÓDIGO A GITHUB CON SSH

## ✅ **ESTADO ACTUAL**
- Repositorio git inicializado
- 271 archivos listos para subir
- Commit creado con mensaje descriptivo
- Remote configurado

---

## 📋 **PASO A PASO - MÉTODO SSH**

### **PASO 1: Verificar si ya tienes una llave SSH**

Abre tu terminal y ejecuta:

```bash
ls -la ~/.ssh
```

**¿Qué buscar?**
- Si ves archivos como `id_rsa.pub` o `id_ed25519.pub` → **YA TIENES LLAVE** (ve al PASO 3)
- Si no existe la carpeta o está vacía → **NECESITAS CREAR UNA** (ve al PASO 2)

---

### **PASO 2: Crear nueva llave SSH** (solo si no tienes una)

```bash
ssh-keygen -t ed25519 -C "juansanchez1966.hb@gmail.com"
```

**Durante el proceso:**
1. Te preguntará dónde guardar la llave → **PRESIONA ENTER** (usa la ubicación por defecto)
2. Te pedirá un passphrase → **PRESIONA ENTER DOS VECES** (sin contraseña, más fácil)

Verás algo como:
```
Your identification has been saved in /home/tu-usuario/.ssh/id_ed25519
Your public key has been saved in /home/tu-usuario/.ssh/id_ed25519.pub
```

---

### **PASO 3: Copiar tu llave pública**

Ejecuta este comando para ver tu llave:

```bash
cat ~/.ssh/id_ed25519.pub
```

O si tienes llave RSA antigua:
```bash
cat ~/.ssh/id_rsa.pub
```

**COPIA TODO EL CONTENIDO** que aparece (empieza con `ssh-ed25519` o `ssh-rsa`)

---

### **PASO 4: Agregar la llave a GitHub**

Ya que tienes GitHub abierto:

1. **Ve a:** https://github.com/settings/keys
2. **Click en:** "New SSH key" (botón verde)
3. **Title:** Escribe algo como "Mi Computadora" o "Laptop Personal"
4. **Key type:** Deja "Authentication Key"
5. **Key:** PEGA la llave que copiaste del paso 3
6. **Click en:** "Add SSH key"
7. GitHub puede pedirte tu contraseña → ingrésala

---

### **PASO 5: Verificar conexión SSH**

En tu terminal:

```bash
ssh -T git@github.com
```

**Primera vez:**
- Te preguntará: "Are you sure you want to continue connecting?" → Escribe **yes** y ENTER

**Respuesta exitosa:**
```
Hi JuanSanchez1966-HB! You've successfully authenticated, but GitHub does not provide shell access.
```

✅ Si ves este mensaje = **ÉXITO!**

---

### **PASO 6: Cambiar remote a SSH**

En la carpeta de tu proyecto HUMANBIBLIO, ejecuta:

```bash
git remote set-url origin git@github.com:JuanSanchez1966-HB/humanbiblio-mvp.git
```

Verifica que cambió:
```bash
git remote -v
```

Debe mostrar:
```
origin  git@github.com:JuanSanchez1966-HB/humanbiblio-mvp.git (fetch)
origin  git@github.com:JuanSanchez1966-HB/humanbiblio-mvp.git (push)
```

---

### **PASO 7: ¡SUBIR EL CÓDIGO!**

```bash
git push -u origin main
```

Verás algo como:
```
Enumerating objects: 300, done.
Counting objects: 100% (300/300), done.
Delta compression using up to 8 threads
Compressing objects: 100% (250/250), done.
Writing objects: 100% (300/300), 2.5 MiB | 1.2 MiB/s, done.
Total 300 (delta 50), reused 0 (delta 0)
To github.com:JuanSanchez1966-HB/humanbiblio-mvp.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ **¡LISTO! Tu código está en GitHub**

---

### **PASO 8: Verificar en GitHub**

1. Ve a: https://github.com/JuanSanchez1966-HB/humanbiblio-mvp
2. Deberías ver todos tus archivos
3. El README.md se mostrará automáticamente

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### Error: "Permission denied (publickey)"
→ La llave SSH no está configurada correctamente
→ Repite desde el PASO 3

### Error: "Could not resolve hostname"
→ Problema de conexión a internet
→ Verifica tu conexión

### Error: "Repository not found"
→ Verifica que el repositorio existe en GitHub
→ Ve a: https://github.com/JuanSanchez1966-HB/humanbiblio-mvp

---

## 📞 **¿NECESITAS AYUDA?**

Dime en qué paso estás y qué mensaje te aparece. ¡Te ayudo!

---

**Autor:** Juan Sanchez
**Fecha:** 2025-11-30
**Proyecto:** HUMANBIBLIO MVP
