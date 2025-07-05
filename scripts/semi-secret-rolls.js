console.log('semi-secret-rolls | Init begin');

Hooks.on('init', () => {
    game.settings.register('semi-secret-rolls', 'ignoreGM', {
        name: '[GM] Ignore GMs',
        hint: 'If turned ON, then it will not roll semi-secret rolls for Gamemaster accounts.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        requiresReload: false
    });

    game.settings.register('semi-secret-rolls', 'semiSecretDiceGlobal', {
        name: '[GM] Semi-Secret Dice Amount',
        hint: 'Word level overwrite to the semi-secret roll dice amount. If set to 0 it allows each client to set their own (this part requires a reload).',
        scope: 'world',
        config: true,
        type: Number,
        default: 4,
        requiresReload: false
    });

    if (game.settings.get('semi-secret-rolls','semiSecretDiceGlobal') === 0) {
        game.settings.register('semi-secret-rolls', 'SemiSecretDiceClient', {
            name: '[Client] Semi-Secret Dice Amount',
            hint: 'Sets your own personal amount of semi-secret roll dice amount.',
            scope: 'client',
            config: true,
            type: Number,
            default: 4,
            requiresReload: false
        });
    }

    game.settings.register('semi-secret-rolls', 'visibility', {
        name: '[GM] Semi Secret Visibility',
        hint: 'Set who sees the semi-secret rolls.',
        scope: 'world',
        config: true,
        type: Number,
        default: 1,
        requiresReload: false,
        choices: {
            1: "Public",
            2: "Everyone except the GM",
            3: "Player and the GM",
            4: "Only the player",
        },
    })

    /*game.settings.register('semi-secret-rolls', 'test', {
        name: 'testTest',
        hint: 'testTestTest',
        scope: 'world',     // "world" = sync to db, "client" = local storage
        config: true,       // false if you don't want it to show in module config
        type: Number,       // You want the primitive class, e.g. Number, not the name of the class as a string
        default: 0,
        onChange: value => { // value is the new value of the setting
            console.log(value)
        },
        requiresReload: true, // true if you want to prompt the user to reload
        // Creates a select dropdown
        choices: {
            1: "Option Label 1",
            2: "Option Label 2",
            3: "Option Label 3"
        },
        // Number settings can have a range slider, with an optional step property
        range: {
            min: 0,
            step: 2,
            max: 10
        },
        // "audio", "image", "video", "imagevideo", "folder", "font", "graphics", "text", or "any"
        filePicker: "any"
    });*/
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap
    }
    return array;
}

function getSpeaker(user) {
    const actor = user.character;
    if (!actor) {
        return {
            alias: user.name,
            user: user.id
        };
    }
    return ChatMessage.getSpeaker({ actor });
}

Hooks.on('createChatMessage', async (chatLog, message) => {
    if (chatLog.author.id !== game.user.id) {
        return;
    }
    if (chatLog.author.isGM && game.settings.get('semi-secret-rolls','ignoreGM')) {
        return;
    }
    if (chatLog.flags.semiSecretRolls?.semiSecret) {
        return;
    }

    //console.log(chatLog);
    //console.log(message);

    let speaker = chatLog.speaker;
    let isHiddenFromPlayer = false;
    let rolls = [];
    let whisperIds = [];
    let content = "You rolled one of these:";
    let mask_dice_amount

    if (game.settings.get('semi-secret-rolls','semiSecretDiceGlobal') === 0) {
        mask_dice_amount = game.settings.get('semi-secret-rolls','semiSecretDiceClient')
    } else {
        mask_dice_amount = game.settings.get('semi-secret-rolls','semiSecretDiceGlobal');
    }

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

    let formula = chatLog.rolls[0]._formula

    const originalRollData = chatLog.rolls[0].toJSON();
    originalRollData.options = {};
    console.log(originalRollData);
    rolls.push(Roll.fromData(originalRollData));

    for (let i = 0; i < (mask_dice_amount - 1); i++) {
        const roll = new Roll(formula);
        await roll.evaluate();
        rolls.push(roll);
    }

    console.log(rolls);
    rolls = shuffle(rolls);

    for (let i = 0; i < mask_dice_amount; i++) {
        content += await rolls[i].render();
    }

    switch (game.settings.get('semi-secret-rolls', 'visibility')) {
        case 1:
            break;
        case 2:
            whisperIds = game.users.filter(u => !u.isGM);
            if (chatLog.author.isGM) {
                speaker = getSpeaker(whisperIds[0]);
            }
            break;
        case 3:
            whisperIds = game.users.filter(u => u.isGM);
            whisperIds.push(chatLog.author);
            break;
        case 4:
            whisperIds.push(chatLog.author);
            break;
    }

    ChatMessage.create({
        speaker,
        content,
        rollMode: CONST.DICE_ROLL_MODES.PUBLIC,
        whisper: whisperIds,
        flags: {
            "semiSecretRolls": {
                semiSecret: true
            }
        }
    });
});

console.log('semi-secret-rolls | Init done');