let translatable = java('net.minecraft.network.chat.TranslatableComponent')

//物品提示修改
onEvent('item.tooltip', event => {
    //发情药水的药水效果提示修改
    event.addAdvanced([
        'minecraft:potion',
        'minecraft:splash_potion',
        'minecraft:lingering_potion',
        'minecraft:tipped_arrow'
    ], (item, advanced, text) => {
        if (text != null &&
            text.get(1) != null &&
            text.get(1).args.length != 0 &&
            text.get(1).args[0].args.length != 0 &&
            text.get(1).args[0].args[0].key != null &&
            text.get(1).args[0].args[0].key.includes('unregistered_sadface') &&
            text.get(0).siblings.toArray().length != 0 &&
            text.get(0).siblings[0] != null &&
            text.get(0).siblings[0].key != null
        ) {
            if (text.get(0).siblings[0].key.includes('oestrus_potion_strong')) {
                text.get(1).args[0].args[0] = new translatable('发情+')
            } else if (text.get(0).siblings[0].key.includes('oestrus_potion')) {
                text.get(1).args[0].args[0] = new translatable('发情')
            }
        }
    })

    //药水注射器提示修改
    event.addAdvanced([
        'thermal:potion_infuser'
    ], (item, advanced, text) => {
        if (text != null &&
            text.size() > 9 &&
            text.get(9) != null &&
            text.get(9).args.length != 0 &&
            text.get(9).args[0].args.length != 0 &&
            text.get(9).args[0].args[0].key != null &&
            text.get(9).args[0].args[0].key.includes('unregistered_sadface') &&
            text.get(5).key != null
        ) {
            if (text.get(5).key.includes('oestrus_potion_strong')) {
                text.get(9).args[0].args[0] = new translatable('发情+')
            } else if (text.get(5).key.includes('oestrus_potion')) {
                text.get(9).args[0].args[0] = new translatable('发情')
            }
        }
    })

    //手持 松香   右键 烘干机 获得 干松香
    event.add('oestrus:dried_rosin',
        Text.blue("手持")
        .append(Text.red("松香"))
        .append(Text.blue("右键"))
        .append(Text.red("烘干机"))
        .append(Text.blue("获得"))
    );
    //手持 任意花 右键 烘干机 获得 花尘
    event.add('oestrus:flowers_dust',
        Text.blue("手持")
        .append(Text.red("任意花"))
        .append(Text.blue("右键"))
        .append(Text.red("烘干机"))
        .append(Text.blue("获得"))
    );

    //氨基丙苯介绍
    event.add('oestrus:c9h11no', [
        Text.blue("现实中一类较烈性的催情剂，副作用明显"),
        Text.blue("但是可惜这里不是现实"),
        "",
        "并不建议食用"
    ]);

    //香薰和镇定剂说明
    event.add('oestrus:aromatherapy', [
        Text.blue("服用获得")
        .append(Text.green('镇定 10秒'))
        .append(Text.blue('效果')),
        Text.red("镇定：免疫发情")
    ]);
    event.add('oestrus:downer', [
        Text.blue("服用获得")
        .append(Text.green('镇定 60秒'))
        .append(Text.blue('效果')),
        Text.red("镇定：免疫发情")
    ]);

    //花粹介绍
    event.add('oestrus:flowers_extracts', [
        Text.blue("可以与食物合成，使用方法见")
        .append(Text.lightPurple('花粹混合器')),
        Text.green("合成的食物食用后获得发情效果"),
        Text.green("(120秒，发情(+) 3级)"),
        "",
        "不建议饮用"
    ])

    //注入药水可疑提示
    event.addAdvancedToAll((item, addAdvanced, text) => {
        if (item.nbt != null &&
            item.nbt.getByte("add_potion:disable") == 1) {
            text.add(Text.darkRed('可疑の食物'))
        }
    })

    //花粹混合器提示
    event.add('oestrus:extracts_mix_block', [
        Text.blue('副手持 ').append(Text.red('花粹')),
        Text.blue('主手持 ').append(Text.red('食物')),
        Text.red('右击 花粹混合器').append(Text.blue('  即可下药'))
    ])

    //矿机提示
    event.add('oregen:ore_machine', [
        Text.blue('在其下方放置').append(Text.red('原矿')),
        Text.blue('在其上方放置').append(Text.red('投掷器'))
    ])

    //极光新月提示
    event.addAdvanced('oestrus:aurora_crescent',
        (item, advanced, text) => {
            text.clear()
            text.add(Text.lightPurple('极光新月').bold())
            text.add(Text.darkPurple('不知何时何处升起的新月……'))
            text.add(Text.darkPurple('亦不知何时何处渲开的极光……'))
            text.add(Text.white('————————————————————'))
            text.add(Text.red('时间静止了，这一刻你和极光新月共同见证'))
            text.add('')
            text.add(Text.gray('不知藏了谁的泪水').italic())
            text.add('')
            text.add(Text.darkGray('“极目惊光霓霞雨，沏雪蚀心月上钩”').italic())
        })
})