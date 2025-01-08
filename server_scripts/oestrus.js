//玩家登录事件
onEvent('player.logged_in', event => {
    let player = event.player

    //初始化玩家镇定时间
    if (player.nbt.get('CantOestrus') == null) {
        player.nbt.putInt("CantOestrus", 0)
    }
    //初始化重置进度条
    if (player.nbt.get('fullTimeResetConfig') == null) {
        player.nbt.putInt("fullTimeResetConfig", 0)
    }
})

//玩家事件
onEvent('player.tick', event => {
    let player = event.player
    let minecraftPlayer = event.minecraftPlayer
    let potion = player.potionEffects.getMap()
    let oestrusValues;
    let playerId = player.getId()

    //获取药水效果列表
    if (potion.values().toArray()[0] != undefined) {
        for (let i = 0; i < potion.values().toArray().length; i++) {
            let values = potion.values().toArray()[i].toString()
            let keyset = potion.keySet().toArray()[i]
            let effect = player.potionEffects.getActive(keyset)

            //如果有未注册药效，则肯定是发情，实行替换
            if (values.includes('effect.unregistered_sadface')) {
                let duration = effect.duration
                let amplifier = effect.amplifier
                console.log(duration);

                if (keyset == global.oestrusPlusEffect) {
                    player.potionEffects.add('oestrus:oestrus_plus', duration, amplifier)
                    player.potionEffects.map.remove(keyset)
                }
                if (keyset == global.oestrusEffect) {
                    player.potionEffects.add('oestrus:oestrus', duration, amplifier)
                    player.potionEffects.map.remove(keyset)
                }
            }

            //如果是发情+，则覆盖发情
            if (values.includes('effect.oestrus.oestrus')) {
                if (values.match(/^(.*)oestrus_plus(.*)$/gi) != null) {
                    if (oestrusValues != null) {
                        event.server.runCommandSilent(`effect clear ${playerId} oestrus:oestrus`)
                    }
                    oestrusValues = effect
                }
                if (values.match(/^(.*)oestrus_plus(.*)$/gi) == null) {
                    if (oestrusValues == null) {
                        oestrusValues = effect
                    } else {
                        event.server.runCommandSilent(`effect clear ${playerId} oestrus:oestrus`)
                    }
                }
            }
        }
    }


    //如果有发情效果
    if (oestrusValues != null) {
        //镇定时间，清除效果
        if (player.nbt.get("CantOestrus") > 0) {
            event.server.runCommandSilent(`effect clear ${playerId} oestrus:oestrus`)
            event.server.runCommandSilent(`effect clear ${playerId} oestrus:oestrus_plus`)
        }

        //获得发情效果等级
        let lvl = oestrusValues.amplifier
        lvl++;

        //冒爱心
        let heartNum = lvl * 5 > 20 ? 20 : lvl * 5; //爱心数量每级+5，不超过20
        if (heartClock <= 0) {
            //用指令生成爱心
            if (lvl == 1) {
                for (let i = 0; i < heartNum; i++) {
                    event.server.runCommandSilent(`execute at ${playerId} run particle minecraft:heart ~${Math.random()*1.5-0.75} ~${Math.random()*0.5+1.3} ~${Math.random()*1.5-0.75}`)
                }
            }
        } else if (heartClock % 50 == 0) {
            if (lvl == 2) {
                for (let i = 0; i < heartNum; i++) {
                    event.server.runCommandSilent(`execute at ${playerId} run particle minecraft:heart ~${Math.random()*1.5-0.75} ~${Math.random()*0.5+1.3} ~${Math.random()*1.5-0.75}`)
                }
            }
        } else if (heartClock % 20 == 0) {
            if (lvl >= 3) {
                for (let i = 0; i < heartNum; i++) {
                    event.server.runCommandSilent(`execute at ${playerId} run particle minecraft:heart ~${Math.random()*1.5-0.75} ~${Math.random()*0.5+1.3} ~${Math.random()*1.5-0.75}`)
                }
            }
        }

        //加捆绑速度
        if (tyingClock <= 0) {
            //如果有效果而且没有捆绑条
            let effect = oestrusValues.getEffect()
            if (effect.registryName.toString().includes('oestrus')) {
                //捆绑条，每级+increaseTying
                let timeSet = increaseTying * lvl
                let tags = player.fullNBT
                let curios = tags.get('ForgeCaps').get("curios:inventory").get("Curios")

                /**
                 * 遍历饰品栏找到主捆绑槽位
                 * 判断主捆绑槽是否已满
                 * 若未满则加捆绑条
                 */
                for (let i = 0; i < curios.size(); i++) {
                    if (curios[i].Identifier == "binds") {
                        /**
                         * if 捆绑槽没满
                         * else 捆绑槽满了
                         */
                        if (curios[i].StacksHandler.Stacks.Items.size() != curios[i].StacksHandler.Stacks.Size) {
                            /**
                             * if 发情 且 有捆绑条，加速
                             * else 发情+ 直接加捆绑条
                             */
                            if (!effect.registryName.toString().includes('plus')) {
                                if (minecraftPlayer.abduction$getTyingTime() != 0) {
                                    minecraftPlayer.abduction$addTyingTime(timeSet);
                                    /**
                                     * if 若捆绑条已满，开始计时
                                     *
                                     * if 超过 fullTimeResetConfig 秒则重置捆绑条
                                     */
                                    if (minecraftPlayer.abduction$getTyingTime() == minecraftPlayer.abduction$getMaxTyingTime()) {
                                        player.nbt.putInt('fullTimeResetConfig', player.nbt.getInt('fullTimeResetConfig') + 1)
                                    }
                                    if (player.nbt.getInt('fullTimeResetConfig') > fullTimeResetConfig) {
                                        minecraftPlayer.abduction$addTyingTime(-minecraftPlayer.abduction$getTyingTime())
                                        player.nbt.putInt('fullTimeResetConfig', 0)
                                    }
                                }
                            } else if (effect.registryName.toString().includes('plus')) {
                                minecraftPlayer.abduction$addTyingTime(timeSet);
                                /**
                                 * if 若捆绑条已满，开始计时
                                 *
                                 * if 超过 fullTimeResetConfig 秒则重置哈希值防止锁哈希值不能绑
                                 */
                                if (minecraftPlayer.abduction$getTyingTime() == minecraftPlayer.abduction$getMaxTyingTime()) {
                                    player.nbt.putInt('fullTimeResetConfig', player.nbt.getInt('fullTimeResetConfig') + 1)
                                }
                                if (player.nbt.getInt('fullTimeResetConfig') > fullTimeResetConfig) {
                                    minecraftPlayer.abduction$setTyerHash(0)
                                }
                            }
                        }
                        break
                    }
                }
            }
        }
    }
})

//每tick执行一次，服务器tick
onEvent('server.tick', event => {
    heartClock--
    if (heartClock < 0) {
        heartClock = heartClockConfig
    }
    tyingClock--
    if (tyingClock < 0) {
        tyingClock = tyingClockConfig
    }

    //媚药池
    poolsClock--;
    if (poolsClock <= 0) {
        for (let entity of event.server.entities) {
            //if 是玩家或者动物
            if (entity.isPlayer() || entity.getFullNBT() != null && entity.getFullNBT().get('InLove') != null && entity.isAlive()) {
                /**
                 * if 在媚药池里
                 * else if 在媚药池+里
                 */
                if (entity.block == 'oestrus:oestrus_pools') {
                    /**
                     * @type {Internal.LivingEntity}
                     */
                    let mob = entity.minecraftEntity
                    mob.addEffect(new effectIns('oestrus:oestrus', 320, 1))
                } else if (entity.block == 'oestrus:oestrus_pools_plus') {
                    /**
                     * @type {Internal.LivingEntity}
                     */
                    let mob = entity.minecraftEntity
                    mob.addEffect(new effectIns('oestrus:oestrus_plus', 320, 1))
                }
            }
        }
    }
})

//食用食物事件（被下药之后）
onEvent('item.food_eaten', event => {
    let player = event.player
    let nbt = event.item.nbt
    if (nbt != null &&
        nbt.get("oestrusDrugged") != null &&
        nbt.get("oestrusDrugged")[0] != 0) {
        let effect = nbt.get("oestrusDrugged")
        if (effect[1] == 0) {
            player.potionEffects.add('oestrus:oestrus', (effect[0] + 1) * 20, 2)
        } else if (effect[1] == 1) {
            player.potionEffects.add('oestrus:oestrus_plus', (effect[0] + 1) * 20, 2)
        } else {
            console.log('未知发情等级');
        }
    }
})

//ban掉热力炼金放大组件对发情的加强（仅注射器）
onEvent('item.entity_interact', event => {
    if (!augmentApplyToOestru && event.getHand().toString() == 'MAIN_HAND') {
        if (event.target.isPlayer()) {
            let player = event.player;
            let mainHandItem = player.mainHandItem;

            //if 手持注射器
            if (mainHandItem.id == 'thermal:potion_infuser') {
                let potion = mainHandItem.nbt.get('Fluid').get('Tag').get('Potion')
                let properties = mainHandItem.nbt.get('Properties')

                //是否装了炼金放大组件
                if (properties.getFloat('PotionAmp') != 0 && potion.toString().includes('oestrus')) {
                    player.setStatusMessage(Text.red('炼金放大组件无法作用于发情效果'))
                    event.cancel()
                }
            }
        }
    }
})