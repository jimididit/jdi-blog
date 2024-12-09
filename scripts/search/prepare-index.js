import path from 'path';
import { promises as fs } from 'fs';
import { globby } from 'globby';
import grayMatter from 'gray-matter';

/**
 * Generates a search index for all blog articles in the specified directory.
 */
async function generateSearchIndex() {
    try {
        // Define directories
        // const srcDir = path.join(process.cwd(), 'src');
        const blogDir = path.resolve('src', 'content', 'blog'); // Blog directory
        const publicDir = path.resolve('public'); // Output directory
        const indexFile = path.join(publicDir, 'search-index.json'); // Output file

        // Ensure the public directory exists
        // await fs.mkdir(publicDir, { recursive: true });

        // Find all blog files (.mdx and .mdoc)
        const blogFilePattern = `${blogDir.replace(/\\/g, '/')}/**/*.{mdx,mdoc}`;
        console.log("Glob pattern:", blogFilePattern);
        
        const blogFilePaths = await globby(blogFilePattern);
        console.log("Matched Files:", blogFilePaths);

        // If no files found, log and exit
        if (blogFilePaths.length === 0) {
            console.log('No blog files found to index.');
            return;
        }

        console.log(`Found ${blogFilePaths.length} blog files.`);

        // Parse files and generate index
        const searchIndex = [];
        for (const filePath of blogFilePaths) {
            try {
                const fileContent = await fs.readFile(filePath, 'utf8');
                const { data: frontmatter, content } = grayMatter(fileContent);

                // Extract required fields
                const { title, description, tags } = frontmatter;
                const slug = path.basename(filePath, path.extname(filePath));

                if (!title || !description) {
                    console.warn(`Skipping file (${filePath}): Missing required fields.`);
                    continue;
                }

                searchIndex.push({
                    slug,
                    category: 'blog',
                    title,
                    description,
                    tags: tags || [],
                    body: content,
                });
            } catch (error) {
                console.error(`Error processing file (${filePath}):`, error);
            }
        }

        // Write the index file
        await fs.writeFile(indexFile, JSON.stringify(searchIndex, null, 2), 'utf8');
        console.log(`Successfully created search index with ${searchIndex.length} entries at ${indexFile}`);
    } catch (error) {
        console.error('Error generating search index:', error);
    }
}

// (async function testGlob() {
//     const blogDir = "E:/jimididit/blog/jdi-blog/src/content/blog"; // Use a fixed path for testing
//     const blogFilePattern = `${blogDir}/**/*.{mdx,mdoc}`;

//     const files = await globby(blogFilePattern);
//     console.log("Matched files:", files);
// })();

// Execute the script
generateSearchIndex();
