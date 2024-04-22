// 文件名称：server\routers\codeBot.js

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

/**
 * 递归函数来获取目录结构。
 * @param {string} dirPath 目录的绝对路径
 * @param {string} basePath 基准路径，用于计算相对路径
 * @returns {Object} 目录结构的对象，包括子目录和文件的相对路径
 */
const getDirectoryStructure = (dirPath, basePath) => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    let structure = {};

    entries.forEach((entry) => {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            structure[entry.name] = getDirectoryStructure(fullPath, basePath);
        } else {
            structure[entry.name] = path.relative(basePath, fullPath);
        }
    });

    return structure;
};

/**
 * API端点：获取项目的文件和目录结构。
 */
router.get("/structure", (req, res) => {
    const baseDir = path.resolve(__dirname, "../../src"); // 前端项目的根目录
    const structure = getDirectoryStructure(baseDir, baseDir);
    res.json(structure);
});

/**
 * API端点：获取指定文件的源代码。
 * @param {string} filePath 相对于项目根目录的文件路径
 */
router.get("/code", (req, res) => {
    const filePath = req.query.filePath;
    const absolutePath = path.resolve(__dirname, "../../src", filePath);

    fs.readFile(absolutePath, "utf8", (err, data) => {
        if (err) {
            return res.status(404).json({ error: "File not found." });
        }
        res.type('text/plain');
        res.send(data);
    });
});
console.log(`Current working directory: ${process.cwd()}`);


/**
 * API端点：基本的欢迎信息。
 */
router.get("/", (req, res) => {
    res.json(`Current working directory: ${process.cwd()}`);
});

module.exports = router;
