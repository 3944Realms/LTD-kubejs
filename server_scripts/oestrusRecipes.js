//配方添加
onEvent('recipes', event => {
    //硝基苯
    event.recipes.thermal
        .smelter('oestrus:c6h5no2', ['4x #minecraft:coals', '4x #forge:gems/niter', '#forge:gems/sulfur'])
        .energy(12000)

    //氨基丙苯
    event.recipes.thermal
        .smelter('oestrus:c9h11no', ['4x thermal:rosin', '#forge:beers', 'oestrus:c6h5no2'])
        .energy(24000)

    //香薰
    event.recipes.thermal
        .smelter('oestrus:aromatherapy', ['2x oestrus:dried_rosin', 'minecraft:glass_bottle'])
        .energy(3000)

    //镇定剂
    event.recipes.thermal
        .centrifuge('oestrus:downer', '4x oestrus:aromatherapy')
        .energy(6000)

    //花粹
    event.recipes.thermal
        .centrifuge(['oestrus:flowers_extracts', '3x minecraft:glass_bottle'], '4x oestrus:flowers_dust_in_bottle')
        .energy(6000)

    //花尘水
    event.recipes.minecraft
        .crafting_shapeless('oestrus:flowers_dust_in_bottle', ['kitchenkarrot:water', 'minecraft:glass_bottle', 'oestrus:flowers_dust'])

    //花粹混合器
    event.recipes.minecraft
        .crafting_shaped('oestrus:extracts_mix_block', [
            'CBC',
            'GHG',
            'CDC'
        ], {
            C: '#forge:cobblestone',
            B: 'minecraft:bucket',
            G: '#forge:glass',
            H: 'minecraft:hopper',
            D: 'minecraft:bowl'
        })

    //花尘
    event.recipes.thermal
        .pulverizer('oestrus:flowers_dust', '2x #minecraft:flowers').energy(1000)

    //媚药桶
    event.recipes.minecraft
        .crafting_shapeless('oestrus:oestrus_pools_bucket', ['oestrus:flowers_extracts', 'minecraft:water_bucket'])

    //媚药桶+
    event.recipes.minecraft
        .crafting_shapeless('oestrus:oestrus_pools_plus_bucket', ['oestrus:c9h11no', 'minecraft:water_bucket'])
})

//自制合成机制
onEvent('block.right_click', event => {
    //烘干机
    if (event.getBlock().getId() == 'modernlife:dryer') {
        if (event.getHand().toString() == 'MAIN_HAND') {
            let item = event.getItem()

            //干松香
            if (item.getId() == 'thermal:rosin') {
                let playerName = event.player.getName().text
                let count = item.count;
                //替换主手物品
                event.server.runCommandSilent(`item replace entity ${playerName} weapon.mainhand with oestrus:dried_rosin ${Math.floor(count)}`)
            }

            //花尘
            if (item.tags.toArray().find(element => element == 'minecraft:flowers') != undefined) {
                let playerName = event.player.getName().text
                let count = item.count
                event.server.runCommandSilent(`item replace entity ${playerName} weapon.mainhand with oestrus:flowers_dust ${Math.floor(count)}`)
            }
        }
    }

    //花粹混合器下药
    if (event.getBlock().getId() == 'oestrus:extracts_mix_block') {
        if (event.getHand().toString() == 'MAIN_HAND') {
            let offItem = event.player.offHandItem

            /**
             * if 副手拿花粹
             *      if 主手是食物
             *          下药
             * else
             *      if 主手是食物
             *          加个nbt
             *
             * 加nbt的目的是为了防止有人开了高级提示框，根据nbt数量判断有没有下药
             */
            if (offItem.getId().toString() == 'oestrus:flowers_extracts') {
                let player = event.player
                let mainItem = player.mainHandItem
                if (mainItem.itemStack.getFoodProperties(player.minecraftLivingEntity) != null) {
                    let nbts = mainItem.nbt
                        // let duration = Math.round(Math.random() * 120 + 60)
                    let duration = 120
                    let amplifier = Math.random() >= 0.5 ? 1 : 0
                    let druggedFood = new itemStack(mainItem.getId())

                    /**
                     * 食物本就有nbt就用put，没有用set
                     * tag必须重新使用该方法复制nbt
                     * 否则会导致 mainItem 和 druggedFood 冲突
                     */
                    if (nbts == null) {
                        druggedFood.setNbt({ "oestrusDrugged": [duration, amplifier] })
                    } else {
                        let tag = new compoundTag()
                        for (let i = 0; i < nbts.getAllKeys().size(); i++) {
                            tag.put(nbts.getAllKeys().toArray()[i], nbts.get(nbts.getAllKeys().toArray()[i]))
                        }
                        tag.put("oestrusDrugged", [duration, amplifier])
                        druggedFood.setNbt(tag)
                    }
                    //给予添加nbt后的食物，花粹-1，食物-1
                    druggedFood.count = 1
                    player.give(druggedFood)
                    mainItem.count--;
                    offItem.count--;
                    player.tell(Text.green('成功给')
                        .append(Text.lightPurple(`${mainItem.itemStack.displayName.string}`))
                        .append(Text.green('添加花粹')))
                } else {
                    player.tell(Text.red('无法添加，请手持食物'))
                }
            } else {
                let player = event.player
                let mainItem = player.mainHandItem

                //如果是食物，且食物没有下药nbt，添加
                if (mainItem.itemStack.getFoodProperties(player.minecraftLivingEntity) != null &&
                    (mainItem.nbt == null || mainItem.nbt.get('oestrusDrugged') == null)) {
                    let druggedFood = new itemStack(mainItem.getId())
                    let tag = new compoundTag()
                    let nbts = mainItem.nbt
                    if (nbts != null) {
                        for (let i = 0; i < nbts.getAllKeys().size(); i++) {
                            tag.put(nbts.getAllKeys().toArray()[i], nbts.get(nbts.getAllKeys().toArray()[i]))
                        }
                    }
                    tag.put("oestrusDrugged", [0, 0])
                    druggedFood.setNbt(tag);
                    //给予添加nbt后的食物
                    druggedFood.count = mainItem.count
                    player.give(druggedFood)
                    mainItem.count = 0
                }
            }
        }
    }
})

//使花粹混合器可以被挖
onEvent('tags.blocks', event => {
    event.add('minecraft:needs_iron_tool', 'oestrus:extracts_mix_block')
    event.add('minecraft:mineable/pickaxe', 'oestrus:extracts_mix_block')
})