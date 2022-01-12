export default [
    {name: "leather", label: "かわよろい", type: "body", effects: [{type: "dodge", amount: 0.1}]},
    {name: "plate", label: "むねあて", type: "body", effects: [{type: "hp", amount: 0.2}]},
    {name: "robe", label: "ローブ", type: "body", effects: [{type: "spell", amount: 0.25}, {type: "hp", amount: -0.1}]},
    {name: "helm", label: "かぶと", type: "head", effects: [{type: "hp", amount: 0.1}]},
    {name: "hat", label: "とんがりぼうし", type: "head", effects: [{type: "spell", amount: 0.15}]},
    {name: "sword", label: "けん", type: "primary", damage: [3, 6, 2], effects:[]},
    {name: "rapier", label: "レイピア", type: "primary", damage: [2, 5, 2], effects:[], dodge:[{type: "damage", amount: 0.5, duration: 2}]},
    {name: "idol", label: "ひすいのぐうぞう", type: "secondary", effects:[], bolt:[{type: "sdamage", amount: 2}, {type: "dodge", amount: -0.25, duration: 3}]},
    {name: "thor", label: "トールハンマー", type: "primary", damage:[1, 15, 1], effects:[], bolt:[{type: "damage", amount: .5, duration: 2}]},
    {name: "goblet", label: "ちのさかずき", type: "secondary", effects:[], heal:[{type: "sdamage", amount: 2}]},
    {name: "saint", label: "せいじゃのかんむり", type: "head", effects:[{type: "hp", amount: .1}], heal:[{type: "sheal", amount: 1}]}
];