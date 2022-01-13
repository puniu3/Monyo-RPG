export default [
    {name: "leather", value: 10, label: "かわよろい", type: "body", effects: [{type: "dodge", amount: 0.1}]},
    {name: "plate", value: 20, label: "むねあて", type: "body", effects: [{type: "hp", amount: 0.2}]},
    {name: "robe", value: 10, label: "ローブ", type: "body", effects: [{type: "spell", amount: 0.25}, {type: "hp", amount: -0.1}]},
    {name: "helm", value: 10, label: "かぶと", type: "head", effects: [{type: "hp", amount: 0.1}]},
    {name: "hat", value: 10, label: "とんがりぼうし", type: "head", effects: [{type: "spell", amount: 0.15}]},
    {name: "sword", value: 45, label: "ぎんのつるぎ", type: "primary", damage: [3, 6, 2], effects:[]},
    {name: "rapier", value: 30, label: "レイピア", type: "primary", damage: [2, 5, 2], effects:[], dodge:[{type: "damage", amount: 0.5, duration: 2}]},
    {name: "idol", value: 20, label: "ひすいのぐうぞう", type: "secondary", effects:[], bolt:[{type: "sdamage", amount: 2}, {type: "dodge", amount: -0.25, duration: 3}]},
    {name: "thor", value: 40, label: "トールハンマー", type: "primary", damage:[1, 15, 1], effects:[], bolt:[{type: "damage", amount: .5, duration: 2}]},
    {name: "goblet", value: 30, label: "ちのさかずき", type: "secondary", effects:[], heal:[{type: "sdamage", amount: 2}]},
    {name: "saint", value: 40, label: "せいじゃのかんむり", type: "head", effects:[{type: "hp", amount: .1}], heal:[{type: "sheal", amount: 1}]},
    {name: "rod", value: 10, label: "つえ", type: "primary", damage:[1, 3, 2], effects:[], attack:[{type: "spell", amount: .5, duration: 3}]},
    {name: "ranger", value: 30, label: "のぶせのくつ", type: "feet", effects:[{type: "dodge", amount: 0.1}], heal:[{type:"sheal", amount: -1}]},
    {name: "talisman", value: 20, label: "まよけ", type: "secondary", effects:[], parry:[{type:"spell", amount:.25, duration:3}]},
    {name: "paladin", value: 50, label:"せいきしのよろい", type:"body", effects:[{type:"hp", amount:.1}], heal:[{type:"dodge", amount:.5, duration:1}]},
    {name: "shield", value: 20, label:"たて", type:"secondary", effects:[{type:"dodge", amount:.05}]},
    {name: "greaves", value: 30, label:"すねあて", type:"feet", effects:[{type:"hp", amount:.1}]}
];