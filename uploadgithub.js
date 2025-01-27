import fetch from 'node-fetch'
import { basename } from 'path'
import { Octokit } from '@octokit/rest'

// GitHub Configuration
const GITHUB_TOKEN = 'ghp_YOUR_GITHUB_TOKEN' // Ganti dengan token GitHub Anda
const GITHUB_USERNAME = 'your-username' // Ganti dengan username GitHub Anda
const GITHUB_REPO = 'your-repo' // Ganti dengan nama repository
const GITHUB_BRANCH = 'main' // atau 'master' sesuai branch utama Anda

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!text) throw `Example: ${usedPrefix + command} filename`
    if (!mime) throw 'Reply file yang akan diupload!'
    
    let filename = text.endsWith('.js') ? text : text + '.js'
    
    try {
        m.reply('Sedang mengupload file ke GitHub...')
        
        // Inisialisasi Octokit
        const octokit = new Octokit({
            auth: GITHUB_TOKEN
        })
        
        // Get file content
        let media = await q.download()
        let content = media.toString()
        
        try {
            // Cek if file exists
            const { data: existingFile } = await octokit.repos.getContent({
                owner: GITHUB_USERNAME,
                repo: GITHUB_REPO,
                path: filename,
                ref: GITHUB_BRANCH
            })
            
            // Update existing file
            await octokit.repos.createOrUpdateFileContents({
                owner: GITHUB_USERNAME,
                repo: GITHUB_REPO,
                path: filename,
                message: `Update ${filename}`,
                content: Buffer.from(content).toString('base64'),
                sha: existingFile.sha,
                branch: GITHUB_BRANCH
            })
            
            m.reply(`File berhasil diupdate di GitHub!\nURL: https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${filename}`)
            
        } catch (err) {
            if (err.status === 404) {
                // Create new file
                await octokit.repos.createOrUpdateFileContents({
                    owner: GITHUB_USERNAME,
                    repo: GITHUB_REPO,
                    path: filename,
                    message: `Add ${filename}`,
                    content: Buffer.from(content).toString('base64'),
                    branch: GITHUB_BRANCH
                })
                
                m.reply(`File berhasil diupload ke GitHub!\nURL: https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${filename}`)
            } else {
                throw err
            }
        }
        
    } catch (error) {
        console.error('Error:', error)
        throw 'Terjadi kesalahan saat mengupload file!'
    }
}

handler.help = ['uploadgithub']
handler.tags = ['owner']
handler.command = /^uploadgithub$/i
handler.owner = true

export default handler