console.log('semi-secret-rolls | Init begin');
const moduleId = 'semi-secret-rolls';

Hooks.on('init', () => {
    game.settings.register('semi-secret-rolls', 'softDisable', {
        name: '[GM] Disable Module',
        hint: 'Disables the module without reloading (works immediately for everyone).',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        requiresReload: false
    });

    game.settings.register('semi-secret-rolls', 'ignoreGM', {
        name: '[GM] Ignore GMs',
        hint: 'If turned ON, it will not roll semi-secret rolls for Gamemaster accounts.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        requiresReload: false
    });

    game.settings.register('semi-secret-rolls', 'DiceBehaviour', {
        name: '[GM] Dice Amount Behaviour',
        hint: 'Set what determines dice amounts.',
        scope: 'world',
        config: true,
        type: Number,
        default: 0,
        requiresReload: false,
        choices: {
            0: "GM dice amount (for everyone).",
            1: "Clients dice amount.",
            2: "Dynamic dice amount."
        },
    });

    game.settings.register('semi-secret-rolls', 'DiceAmountGlobal', {
        name: '[GM] Global Dice Amount',
        hint: 'Word level overwrite to the semi-secret roll dice amount. Only applied if Dice Amount Behaviour is set to "GM dice amount." or when "Dynamic dice amount." is set and the roll has no proficiency modifier.',
        scope: 'world',
        config: true,
        type: Number,
        default: 4,
        requiresReload: false,
    });

    game.settings.register('semi-secret-rolls', 'DiceAmountClient', {
        name: '[Client] Dice Amount',
        hint: 'Sets your own personal amount of semi-secret roll dice amount. Only applied if Dice Amount Behaviour is set to "Clients dice amount."',
        scope: 'client',
        config: true,
        type: Number,
        default: 4,
        requiresReload: false,
    });

    game.settings.register('semi-secret-rolls', 'DynamicDiceUntrained', {
        name: '[GM] Dynamic Dice Amount (untrained)',
        hint: 'How many dice should be rolled for untrained skills. Only applied if Dice Amount Behaviour is set to "Dynamic dice amount."',
        scope: 'world',
        config: true,
        type: Number,
        default: 6,
        requiresReload: false,
    });

    game.settings.register('semi-secret-rolls', 'DynamicDiceTrained', {
        name: '[GM] Dynamic Dice Amount (trained)',
        hint: 'How many dice should be rolled for trained skills. Only applied if Dice Amount Behaviour is set to "Dynamic dice amount."',
        scope: 'world',
        config: true,
        type: Number,
        default: 5,
        requiresReload: false,
    });

    game.settings.register('semi-secret-rolls', 'DynamicDiceExpert', {
        name: '[GM] Dynamic Dice Amount (expert)',
        hint: 'How many dice should be rolled for expert skills. Only applied if Dice Amount Behaviour is set to "Dynamic dice amount."',
        scope: 'world',
        config: true,
        type: Number,
        default: 4,
        requiresReload: false,
    });

    game.settings.register('semi-secret-rolls', 'DynamicDiceMaster', {
        name: '[GM] Dynamic Dice Amount (master)',
        hint: 'How many dice should be rolled for master skills. Only applied if Dice Amount Behaviour is set to "Dynamic dice amount."',
        scope: 'world',
        config: true,
        type: Number,
        default: 3,
        requiresReload: false,
    });

    game.settings.register('semi-secret-rolls', 'DynamicDiceLegendary', {
        name: '[GM] Dynamic Dice Amount (legendary)',
        hint: 'How many dice should be rolled for legendary skills. Only applied if Dice Amount Behaviour is set to "Dynamic dice amount."',
        scope: 'world',
        config: true,
        type: Number,
        default: 2,
        requiresReload: false,
    });

    game.settings.register('semi-secret-rolls', 'DynamicDiceMythic', {
        name: '[GM] Dynamic Dice Amount (mythic)',
        hint: 'How many dice should be rolled for mythic skills. Only applied if Dice Amount Behaviour is set to "Dynamic dice amount."',
        scope: 'world',
        config: game.pf2e.settings.campaign.mythic !== 'disabled',
        type: Number,
        default: 1,
        requiresReload: false,
    });

    game.settings.register('semi-secret-rolls', 'visibility', {
        name: '[GM] Semi Secret Visibility',
        hint: 'Set who sees the semi-secret rolls.',
        scope: 'world',
        config: true,
        type: Number,
        default: 1,
        requiresReload: false,
        choices: {
            0: "Public",
            1: "Everyone except the GM",
            2: "Player and the GM",
            3: "Only the player",
        },
    })

    game.settings.register('semi-secret-rolls', 'displayType', {
        name: '[Client] Display Type',
        hint: 'Places the little · in between the rolls for better visibility.',
        scope: 'client',
        config: true,
        type: Number,
        default: 0,
        requiresReload: false,
        choices: {
            0: "Full rolls with · dividers",
            1: "Full rolls",
            2: "List of sum values",
            //3: "List of natural dice rolls",
        },
    })

    game.settings.register('semi-secret-rolls', 'debugLogging', {
        name: '[GM] Debug Logging',
        hint: 'Enables logs to be displayed in the console.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        requiresReload: false,
    })

    game.settings.register('semi-secret-rolls', 'previousVersion', {
        name: 'previous version number',
        hint: '',
        scope: 'world',
        config: game.settings.get('semi-secret-rolls', 'debugLogging'),
        type: String,
        default: '0.2.1',
        requiresReload: false,
    })

    game.settings.register('semi-secret-rolls', 'firstLoad', {
        name: 'first load marker',
        hint: 'to not send warning message',
        scope: 'world',
        config: game.settings.get('semi-secret-rolls', 'debugLogging'),
        type: Boolean,
        default: true,
        requiresReload: false,
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

Hooks.on("ready", () => {
    const moduleData = game.modules.get(moduleId);
    const debug = game.settings.get('semi-secret-rolls','debugLogging');
    if (debug) console.log('Module version:', moduleData.version);

    const warn_at_and_below = '0.2.1'
    const last_version_splits = game.settings.get('semi-secret-rolls', 'previousVersion').split('.').map(Number);
    const warn_version_splits = warn_at_and_below.split('.').map(Number);

    if (!game.settings.get('semi-secret-rolls', 'firstLoad')) {
        if (warn_version_splits[0] > last_version_splits[0] ||
            warn_version_splits[0] === last_version_splits[0] && warn_version_splits[1] > last_version_splits[1] ||
            warn_version_splits[0] === last_version_splits[0] && warn_version_splits[1] === last_version_splits[1] && warn_version_splits[2] >= last_version_splits[2]
        ) {
            if (debug) console.log('sending warning message...');

            ChatMessage.create({
                content: '<strong>⚠ Warning:</strong> Semi-Secret Rolls changed some core settings in a way previous settings couldn\'t be kept, please check your settings.',
                speaker: {alias: "System"}
            });
        }
    }

    game.settings.set('semi-secret-rolls', 'previousVersion', moduleData.version);
    game.settings.set('semi-secret-rolls', 'firstLoad', false);
    if (debug) console.log('mythic status', game.pf2e.settings.campaign.mythic !== 'disabled');
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
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
    if (game.settings.get('semi-secret-rolls','softDisable')) {
        return;
    }
    if (chatLog.author.id !== game.user.id) {
        return;
    }
    if (chatLog.author.isGM && game.settings.get('semi-secret-rolls','ignoreGM')) {
        return;
    }
    if (chatLog.flags.semiSecretRolls?.semiSecret) {
        return;
    }
    const debug = game.settings.get('semi-secret-rolls','debugLogging');

    if (debug) console.log('chatlog', chatLog);
    if (debug) console.log('message', message);

    let isHiddenFromPlayer = false;
    if (chatLog.flags.pf2e?.context?.rollMode === 'blindroll') {
        if (debug) console.log('trigger module due to: \'blindroll\' pf2e roll mode');
        isHiddenFromPlayer = true;
    } else if (chatLog.flags.pf2e?.context?.traits.includes('secret')) {
        if (debug) console.log('trigger module due to: \'secret\' trait');
        isHiddenFromPlayer = true;
    } else if (message.rollMode === 'blindroll') {
        if (debug) console.log('trigger module due to: \'blindroll\' roll mode');
        isHiddenFromPlayer = true;
    }

    if (!isHiddenFromPlayer) {
        return;
    }

    let speaker = chatLog.speaker;
    let rolls = [];
    let whisperIds = [];
    let content = "You rolled one of these: ";
    let mask_dice_amount

    switch (game.settings.get('semi-secret-rolls', 'DiceBehaviour')) {
        case 0:
            mask_dice_amount = game.settings.get('semi-secret-rolls','DiceAmountGlobal');
            break;
        case 1:
            mask_dice_amount = game.settings.get('semi-secret-rolls','DiceAmountClient');
            break;
        case 2:
            if (debug) console.log('roll for dynamic checking:', chatLog);
            if (chatLog.flags.pf2e?.modifiers) {
                for (let i = 0; i < chatLog.flags.pf2e?.modifiers.length; i++) {
                    if (chatLog.flags.pf2e.modifiers[i].slug === 'proficiency') {
                        switch (chatLog.flags.pf2e.modifiers[i].label) {
                            case 'Untrained':
                                mask_dice_amount = game.settings.get('semi-secret-rolls','DynamicDiceUntrained');
                                break;
                            case 'Trained':
                                mask_dice_amount = game.settings.get('semi-secret-rolls','DynamicDiceTrained');
                                break;
                            case 'Expert':
                                mask_dice_amount = game.settings.get('semi-secret-rolls','DynamicDiceExpert');
                                break;
                            case 'Master':
                                mask_dice_amount = game.settings.get('semi-secret-rolls','DynamicDiceMaster');
                                break;
                            case 'Legendary':
                                mask_dice_amount = game.settings.get('semi-secret-rolls','DynamicDiceLegendary');
                                break;
                            case 'Mythic':
                                mask_dice_amount = game.settings.get('semi-secret-rolls','DynamicDiceMythic');
                                break;
                        }
                    }
                }
            } else {
                mask_dice_amount = game.settings.get('semi-secret-rolls','DiceAmountGlobal');
            }
            break;
    }

    let formula = chatLog.rolls[0]._formula

    const originalRollData = chatLog.rolls[0].toJSON();
    originalRollData.options = {};
    if (debug) console.log('original roll data', originalRollData);
    rolls.push(Roll.fromData(originalRollData));

    for (let i = 0; i < (mask_dice_amount - 1); i++) {
        const roll = new Roll(formula);
        await roll.evaluate();
        rolls.push(roll);
    }

    if (debug) console.log(rolls);
    rolls = shuffle(rolls);

    switch (game.settings.get('semi-secret-rolls','displayType')) {
        case 0:  // Full rolls with · dividers
            if (debug) console.log('running full roll + divider display type');
            for (let i = 0; i < mask_dice_amount; i++) {
                if (i !== 0) content += "·";
                content += await rolls[i].render();
            }
            break;
        case 1:  // Full rolls
            if (debug) console.log('running full roll display type');
            for (let i = 0; i < mask_dice_amount; i++) {
                content += await rolls[i].render();
            }
            break;
        case 2:  // List of sum values
            if (debug) console.log('running sum values display type');
            for (let i = 0; i < mask_dice_amount; i++) {
                if (i !== 0) content += ', ';
                content += await rolls[i]._total;
            }
            break;
        case 3:  // List of natural dice rolls
            // TODO: doesn't work at all yet
            if (debug) console.log('running natural values display type');
            for (let i = 0; i < mask_dice_amount; i++) {
                console.log('depth1');
                content += '\n\n';
                if (rolls[i].terms) {
                    for (let j = 0; i < rolls[i].terms.length; i++) {
                        console.log('depth2');
                        console.log('type', typeof rolls[i].terms[j]);
                    }
                }
            }
            break;
    }

    switch (game.settings.get('semi-secret-rolls', 'visibility')) {
        case 0:
            if (debug) console.log('running public visibility');
            break;
        case 1:
            if (debug) console.log('running everyone except the GM visibility');
            whisperIds = game.users.filter(u => !u.isGM);
            if (chatLog.author.isGM) {
                speaker = getSpeaker(whisperIds[0]);
            }
            break;
        case 2:
            if (debug) console.log('running player and the GM visibility');
            whisperIds = game.users.filter(u => u.isGM);
            whisperIds.push(chatLog.author);
            break;
        case 3:
            if (debug) console.log('running only the player visibility');
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