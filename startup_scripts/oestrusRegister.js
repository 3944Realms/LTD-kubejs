//发情药水效果
onEvent("mob_effect.registry", event => {
    global.oestrusEffect = event.create('oestrus:oestrus')
        .color(0xff69b4)
        .category('neutral')
        .displayName('发情')
        .beneficial()
        .effectTick((entity, lvl) => {
            //动物繁殖
            if (entity.getFullNBT().get('Age') == 0 && entity.getFullNBT().get('InLove') == 0) {
                let tags = entity.getFullNBT()
                tags.put("InLove", 60)
                entity.setFullNBT(tags)
            }
            return
        })
        .createObject()

    global.oestrusPlusEffect = event.create('oestrus:oestrus_plus')
        .color(0xff69b4)
        .category('neutral')
        .displayName('发情+')
        .beneficial()
        .effectTick((entity, lvl) => {
            //动物繁殖
            if (entity.getFullNBT().get('Age') == 0 && entity.getFullNBT().get('InLove') == 0) {
                let tags = entity.getFullNBT()
                tags.put("InLove", 120)
                entity.setFullNBT(tags)
            }
            return
        })
        .createObject()
})

//注册药水
onEvent('potion.registry', event => {
    event.create('oestrus:oestrus_potion').effect(global.oestrusEffect, 3600, 1)
    event.create('oestrus:oestrus_potion_delay').effect(global.oestrusEffect, 9600, 1)
    event.create('oestrus:oestrus_potion_strong').effect(global.oestrusPlusEffect, 1800, 1)
})

//药水配方注册
onEvent('morejs.potion_brewing.register', event => {

    //普通药水
    event.addPotionBrewing(
        'oestrus:c9h11no',
        'minecraft:water',
        'oestrus:oestrus_potion'
    )

    //延长药水
    event.addPotionBrewing(
        'minecraft:redstone',
        'oestrus:oestrus_potion',
        'oestrus:oestrus_potion_delay'
    );

    //强化药水
    event.addPotionBrewing(
        "minecraft:glowstone_dust",
        'oestrus:oestrus_potion_delay',
        'oestrus:oestrus_potion_strong',
    );
})

//物品注册
onEvent('item.registry', event => {
    //硝基苯
    event.create('oestrus:c6h5no2')
        .maxStackSize(4)

    //氨基丙苯
    event.create('oestrus:c9h11no')
        .maxStackSize(4)
        .food(food => {
            food
                .hunger(0)
                .saturation(0)
                .alwaysEdible()
                .effect('oestrus:oestrus_plus', 6000, 3, 1)
        })

    //干松香
    event.create('oestrus:dried_rosin')
        .maxStackSize(64)

    //花尘
    event.create('oestrus:flowers_dust')
        .maxStackSize(64)

    //瓶装花尘水
    event.create('oestrus:flowers_dust_in_bottle')
        .maxStackSize(16)

    //花粹
    event.create('oestrus:flowers_extracts')
        .maxStackSize(16)
        .useAnimation('drink')
        .food(food => {
            food
                .hunger(0)
                .saturation(0)
                .alwaysEdible()
                .effect('oestrus:oestrus_plus', 6000, 2, 1)
        })

    //香薰
    event.create('oestrus:aromatherapy')
        .maxStackSize(16)
        .food(food => {
            food
                .hunger(0)
                .saturation(0)
                .alwaysEdible()
                .fastToEat()
                .eaten(ctx => {
                    let nbts = ctx.player.nbt
                    if (nbts.get("CantOestrus") <= 200) {
                        nbts.putInt("CantOestrus", 200)
                    }
                })
        })

    //镇定剂
    event.create('oestrus:downer')
        .maxStackSize(4)
        .food(food => {
            food
                .hunger(0)
                .saturation(0)
                .alwaysEdible()
                .fastToEat()
                .eaten(ctx => {
                    let nbts = ctx.player.nbt
                    if (nbts.get("CantOestrus") <= 1200) {
                        nbts.putInt("CantOestrus", 1200)
                    }
                })
        })

    //极光新月
    event.create('oestrus:aurora_crescent')
        .unstackable()
        .useAnimation('drink')
        .food(food => {
            food
                .hunger(520 * 2)
                .saturation(1314 / 520 / 2)
                .alwaysEdible()
                .effect('minecraft:resistance', 1200, 4, 1)
                .effect('minecraft:speed', 1200, 2, 1)
                .effect('minecraft:regeneration', 1200, 9, 1)
                .effect('minecraft:fire_resistance', 1200, 0, 1)
                .effect('minecraft:jump_boost', 1200, 2, 1)
                .effect('minecraft:water_breathing', 1200, 0, 1)
                .effect('minecraft:conduit_power', 1200, 2, 1)
                .effect('minecraft:dolphins_grace', 1200, 2, 1)
                .effect('minecraft:haste', 1200, 2, 1)
                .effect('minecraft:luck', 1200, 9, 1)
                .effect('minecraft:strength', 1200, 4, 1)
                .eaten(ctx => {
                    ctx.player.tell(Text.lightPurple('这一刻，你与极光新月共同见证……'))
                })
        })

})

//方块注册
onEvent('block.registry', event => {
    //花粹混合器
    event.create('oestrus:extracts_mix_block')
        .material('metal')
        .hardness(2.0)
        .requiresTool(true)
})

//媚药池
onEvent('fluid.registry', event => {
    event.create('oestrus:oestrus_pools')
        .thinTexture(0xFCA8D2)
    event.create('oestrus:oestrus_pools_plus')
        .thinTexture(0xFA7DBC)
})