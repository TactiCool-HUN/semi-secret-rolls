console.log('semi-secret-rolls | Init...');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap
    }
    return array;
}

Hooks.on('createChatMessage', async (chatLog, message) => {
    if (chatLog.flags.semiSecretRolls?.semiSecret || chatLog.author.isGM) {
        return
    }

    console.log(chatLog);
    console.log(message);
    const speaker = chatLog.speaker;
    let isHiddenFromPlayer = false;
    let rolls = [];

    // detect whether the player sees the roll outcome or not
    if (chatLog.flags.pf2e?.context?.rollMode === "blindroll") {
        isHiddenFromPlayer = true;
    } else if (chatLog.flags.pf2e?.context?.traits.includes("secret")) {
        isHiddenFromPlayer = true;
    } else if (message.rollMode === "blindroll") {
        isHiddenFromPlayer = true;
    }

    if (!isHiddenFromPlayer) {
        return;
    }

    // get roll formula
    let formula = chatLog.rolls[0]._formula

    // get the original roll and clear its options
    rolls.push(chatLog.rolls[0]);
    rolls[0].options = {};

    // make other rolls for the masks
    for (let i = 0; i < 3; i++) {
        const roll = new Roll(formula);
        await roll.evaluate();
        rolls.push(roll);
    }

    // shuffle the results with the original
    rolls = shuffle(rolls);

    // send the message
    ChatMessage.create({
        speaker,
        rolls,
        type: CONST.CHAT_MESSAGE_STYLES.ROLLS,
        flags: {
            "semiSecretRolls": {
                semiSecret: true
            }
        }
    });
});
