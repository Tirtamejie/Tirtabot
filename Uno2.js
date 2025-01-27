
import { readFileSync, writeFileSync } from 'fs'

let handler = async (m, { conn, text, usedPrefix, command, args, isAdmin, isOwner }) => {
    const { sender } = m
    if (!text) throw `✳️ Format: ${usedPrefix}${command} <subcommand>\n\n📌 Contoh: ${usedPrefix}${command} join`

    // Read game data
    const getGameData = () => {
        try {
            return JSON.parse(readFileSync('./lib/database/uno.json', 'utf-8'))
        } catch {
            return {}
        }
    }

    // Write game data
    const writeGameData = (data) => {
        writeFileSync('./lib/database/uno.json', JSON.stringify(data, null, 2))
    }

    const games = getGameData()
    const textArgs = text.split(' ')
const subCommand = textArgs[0]
const param = textArgs.slice(1).join(' ')

    // Initialize game if not exists
    if (!games[m.chat]) {
        games[m.chat] = {
            players: [],
            deck: createDeck(),
            discardPile: [],
            currentPlayer: 0,
            direction: 1,
            currentCard: null,
            drawStack: 0,
            blockCardPlayed: false,
            reverseCardPlayed: false,
            stopVotes: new Set(),
            awaitingColorChoice: false
        }
        writeGameData(games)
        m.reply("🎮 UNO game started! Ketik '.uno join' untuk bergabung.")
        return
    }

    const game = games[m.chat]

    switch (subCommand) {
        case "join": {
            if (game.players.find(p => p.id === sender)) {
                throw "❌ Kamu sudah bergabung dalam permainan!"
            }
            game.players.push({ id: sender, hand: [] })
            writeGameData(games)
            m.reply("✅ Kamu telah bergabung dalam permainan UNO!")
            break
        }

        case "start": {
            if (game.players.length < 2) {
                throw "❌ Minimal 2 pemain diperlukan untuk memulai permainan!"
            }
            game.deck = shuffle(game.deck)
            game.players.forEach(player => {
                for (let i = 0; i < 7; i++) {
                    player.hand.push(game.deck.pop())
                }
            })
            game.currentCard = game.deck.pop()
            game.discardPile.push(game.currentCard)
            writeGameData(games)
            await sendGameStatus(conn, m.chat, game)
            break
        }

        case "hand": {
            const player = game.players.find(p => p.id === sender)
            if (!player) throw "❌ Kamu belum bergabung dalam permainan!"
            
            const hand = player.hand.map((card, index) => 
                `${index}: ${card.color} ${card.value}`
            ).join("\n")
            
            await conn.sendMessage(sender, {
                text: `🎮 *UNO Game*\n\n*Kartu Kamu:*\n${hand}`,
                quoted: m
            })
            m.reply("✅ Cek kartu kamu di private chat!")
            break
        }
        
        case "play": {
    const currentPlayer = game.players[game.currentPlayer]
    if (currentPlayer.id !== sender) {
        throw "❌ Bukan giliranmu!"
    }

    const cardIndex = parseInt(param)
    if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= currentPlayer.hand.length) {
        throw "❌ Index kartu tidak valid!"
    }

    const playCard = currentPlayer.hand[cardIndex]
    if (!isValidPlay(game.currentCard, playCard)) {
        throw "❌ Kartu tidak dapat dimainkan! Harus sama warna atau angka."
    }

    // Handle special cards
    switch(playCard.value) {
        case "12": // Draw Two
            game.drawStack += 2
            break
            
        case "wild14": // Draw Four
            if (hasPlayableCard(currentPlayer, game.currentCard)) {
                throw "❌ Wild Draw Four hanya bisa dimainkan jika tidak ada kartu yang cocok!"
            }
            game.drawStack += 4
            game.currentCard.color = "black"
            game.awaitingColorChoice = true
            break
            
        case "10": // Skip
            game.currentPlayer = getNextPlayer(game)
            break
            
        case "11": // Reverse
            game.direction *= -1
            break
            
        case "wild13": // Wild
            game.awaitingColorChoice = true
            break
    }

    // Play the card
    game.currentCard = playCard
    game.discardPile.push(playCard)
    currentPlayer.hand.splice(cardIndex, 1)

    // Check win condition
    if (currentPlayer.hand.length === 0) {
        await conn.sendMessage(m.chat, {
            text: `🎉 *GAME OVER*\n\n@${currentPlayer.id.split('@')[0]} MENANG!`,
            mentions: [currentPlayer.id]
        })
        delete games[m.chat]
        writeGameData(games)
        return
    }

    // Next player
    if (!game.awaitingColorChoice) {
        game.currentPlayer = getNextPlayer(game)
    }
    
    writeGameData(games)
    await sendGameStatus(conn, m.chat, game)
    
    // Notify if color choice needed
    if (game.awaitingColorChoice) {
        m.reply("🎨 Pilih warna dengan command: .uno color <red/yellow/green/blue>")
    }
    break
}

case "draw": {
    const currentPlayer = game.players[game.currentPlayer]
    if (currentPlayer.id !== sender) {
        throw "❌ Bukan giliranmu!"
    }

    // Handle draw stack from +2 or +4
    if (game.drawStack > 0) {
        for (let i = 0; i < game.drawStack; i++) {
            if (game.deck.length === 0) {
                game.deck = shuffle(game.discardPile.slice(0, -1))
                game.discardPile = [game.discardPile[game.discardPile.length - 1]]
            }
            currentPlayer.hand.push(game.deck.pop())
        }
        
        await conn.sendMessage(sender, {
            text: `🎮 *UNO Draw*\n\nKamu mengambil ${game.drawStack} kartu!`
        })
        
        game.drawStack = 0
        game.currentPlayer = getNextPlayer(game)
    } else {
        // Normal draw
        if (game.deck.length === 0) {
            game.deck = shuffle(game.discardPile.slice(0, -1))
            game.discardPile = [game.discardPile[game.discardPile.length - 1]]
        }
        
        currentPlayer.hand.push(game.deck.pop())
        await conn.sendMessage(sender, {
            text: `🎮 *UNO Draw*\n\nKamu mengambil 1 kartu!`
        })
    }

    writeGameData(games)
    await sendGameStatus(conn, m.chat, game)
    break
}

case "color": {
    const currentPlayer = game.players[game.currentPlayer]
    if (!game.awaitingColorChoice || currentPlayer.id !== sender) {
        throw "❌ Tidak perlu memilih warna saat ini!"
    }

    const color = param.toLowerCase()
    if (!["red", "yellow", "green", "blue"].includes(color)) {
        throw "❌ Warna tidak valid! Pilih: red/yellow/green/blue"
    }

    game.currentCard.color = color
    game.awaitingColorChoice = false
    game.currentPlayer = getNextPlayer(game)
    
    writeGameData(games)
    await sendGameStatus(conn, m.chat, game)
    break
}

case "pass": {
    const currentPlayer = game.players[game.currentPlayer]
    if (currentPlayer.id !== sender) {
        throw "❌ Bukan giliranmu!"
    }

    if (hasPlayableCard(currentPlayer, game.currentCard)) {
        throw "❌ Kamu masih punya kartu yang bisa dimainkan!"
    }

    game.currentPlayer = getNextPlayer(game)
    writeGameData(games)
    await sendGameStatus(conn, m.chat, game)
    break
}

case "stop": {
    if (!game.players.find(p => p.id === sender)) {
        throw "❌ Kamu tidak dalam permainan!"
    }

    if (isAdmin || isOwner) {
        await conn.sendMessage(m.chat, {
            text: "🛑 Game dihentikan oleh admin!"
        })
        delete games[m.chat]
        writeGameData(games)
        return
    }

    game.stopVotes.add(sender)
    if (game.stopVotes.size === game.players.length) {
        await conn.sendMessage(m.chat, {
            text: "🛑 Game dihentikan atas persetujuan semua pemain!"
        })
        delete games[m.chat]
        writeGameData(games)
        return
    }

    writeGameData(games)
    m.reply(`✋ Vote stop diterima. Butuh ${game.players.length - game.stopVotes.size} vote lagi.`)
    break
}

case "card": {
    if (!param) throw "❌ Masukkan index kartu!"
    
    const player = game.players.find(p => p.id === sender)
    if (!player) throw "❌ Kamu belum bergabung dalam permainan!"
    
    const cardIndex = parseInt(param)
    if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= player.hand.length) {
        throw "❌ Index kartu tidak valid!"
    }

    const card = player.hand[cardIndex]
    await conn.sendMessage(sender, {
        image: { url: getCardImageUrl(card) },
        caption: `Card ${cardIndex}: ${card.color} ${card.value}`
    })
    m.reply("✅ Gambar kartu dikirim ke private chat!")
    break
}

// Tambahkan helper functions:



        // ... tambahkan case lainnya seperti play, draw, color dll

        default:
            throw `❌ Subcommand tidak valid! Ketik ${usedPrefix}uno info untuk bantuan.`
    }
}

// Helper Functions
function createDeck() {
    const colors = ["red", "yellow", "green", "blue"]
    const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
    const deck = []
    
    colors.forEach(color => {
        values.forEach(value => {
            deck.push({ color, value })
            if (value !== "1") deck.push({ color, value })
        })
    })
    
    // Add wild cards
    for (let i = 0; i < 4; i++) {
        deck.push({ color: "black", value: "wild13" })
        deck.push({ color: "black", value: "wild14" })
    }
    
    return shuffle(deck)
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

function isValidPlay(currentCard, playCard) {
    return (
        playCard.color === "black" || 
        currentCard.color === playCard.color || 
        currentCard.value === playCard.value
    )
}

function getNextPlayer(game) {
    let nextIndex = (game.currentPlayer + game.direction + game.players.length) % game.players.length
    if (nextIndex < 0) nextIndex += game.players.length
    return nextIndex
}

function hasPlayableCard(player, currentCard) {
    return player.hand.some(card => isValidPlay(currentCard, card))
}

// Tambahkan fungsi untuk timeout game
function startGameTimeout(chat) {
    setTimeout(() => {
        const games = getGameData()
        if (games[chat]) {
            conn.sendMessage(chat, {
                text: "⏰ Game berakhir karena timeout!"
            })
            delete games[chat]
            writeGameData(games)
        }
    }, 30 * 60 * 1000) // 30 menit timeout
}

async function sendGameStatus(conn, chat, game) {
    const currentCard = game.currentCard
    const currentPlayer = game.players[game.currentPlayer]
    
    const status = `🎮 *UNO Game Status*\n\n`
        + `Current Card: ${currentCard.color} ${currentCard.value}\n`
        + `Current Player: @${currentPlayer.id.split('@')[0]}\n\n`
        + `Players:\n${game.players.map((p, i) => 
            `${i + 1}. @${p.id.split('@')[0]} (${p.hand.length} cards)`
        ).join('\n')}`

    await conn.sendMessage(chat, {
        text: status,
        mentions: game.players.map(p => p.id)
    })

    // Send current card image
    await conn.sendMessage(chat, {
        image: { url: getCardImageUrl(currentCard) },
        caption: `Current Card: ${currentCard.color} ${currentCard.value}`
    })
}

function getCardImageUrl(card) {
    const baseUrl = "https://raw.githubusercontent.com/abhisheks008/UNO/main/images/"
    if (card.color === "black") {
        return `${baseUrl}${card.value}.png`
    }
    return `${baseUrl}${card.color}${card.value}.png`
}

handler.help = [
    'uno2 join - Join game',
    'uno2 start - Start game',
    'uno2 hand - Check your cards',
    'uno2 play <index> - Play card',
    'uno2 draw - Draw card',
    'uno2 color <color> - Choose color',
    'uno2 info - Show help'
]
handler.tags = ['game']
handler.command = /^(uno2)$/i
handler.group = true
handler.game = true

export default handler