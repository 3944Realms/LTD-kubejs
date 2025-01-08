//镇定时间提示
onEvent('player.tick', event => {
    let player = event.player
    let cantOestrus = player.nbt.get("CantOestrus")

    //镇定时间减少和提示
    if (cantOestrus > 0) {
        player.nbt.putInt("CantOestrus", cantOestrus - 1)
        player.statusMessage = `镇定时间：${Math.round(cantOestrus / 20)}`
    }
})

//空手右键显示镇定时间
onEvent('item.entity_interact', event => {
    if (event.getHand().toString() == 'MAIN_HAND') {
        let item = event.getItem()

        //如果目标为玩家
        if (event.getTarget().isPlayer()) {
            if (item.isEmpty()) {
                let target = event.target.player
                if (target.nbt.get("CantOestrus") > 0) {
                    event.server.runCommandSilent(`tellraw ${event.player} {"text":"目标镇定时间：${Math.round(target.nbt.get("CantOestrus") / 20)}","color":"red"}`)
                }
            }
        }
    }
})