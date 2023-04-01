// rename-files.mjs
import fs from 'fs/promises';
import path from 'path';
import process from 'process';

const folderPath = './packages'; // The path to the packages folder

async function renameFiles(targetPath) {
  try {
    const files = await fs.readdir(targetPath, { withFileTypes: true });

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(targetPath, file.name);

        if (file.isDirectory()) {
          await renameFiles(filePath);
        } else {
          const newPath = path.join(targetPath, file.name.replace(/\.[^/.]+$/, '') + '.js');

          try {
            await fs.rename(filePath, newPath);
            console.log(`Renamed ${filePath} to ${newPath}`);
          } catch (err) {
            console.error('Error renaming file:', err);
          }
        }
      })
    );
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

renameFiles(folderPath);