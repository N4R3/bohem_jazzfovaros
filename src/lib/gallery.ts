import { promises as fs } from "node:fs";
import path from "node:path";
import type { GalleryImage } from "@/lib/types";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function isImageFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

function toTitleFromFilename(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  return base
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function collectImagePaths(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return collectImagePaths(abs);
      }
      if (entry.isFile() && isImageFile(entry.name)) {
        return [abs];
      }
      return [];
    })
  );
  return nested.flat();
}

export async function getGalleryImagesFromPublic(): Promise<GalleryImage[]> {
  const root = path.join(process.cwd(), "public", "images", "gelria");

  try {
    const files = await collectImagePaths(root);
    files.sort((a, b) => a.localeCompare(b, "hu"));

    return files.map((absPath) => {
      const relative = path.relative(path.join(process.cwd(), "public"), absPath).split(path.sep).join("/");
      return {
        src: `/${relative}`,
        alt: toTitleFromFilename(path.basename(absPath)),
      };
    });
  } catch {
    return [];
  }
}
