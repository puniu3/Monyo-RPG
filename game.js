import {round, rnd, attack, pickRnd, sum, multiplier, maxHp, level, gearEffects, gear, describe, wear, stats, label, weaponDmg, loot, tryPush, player} from "./utils.js";
import {orc} from "./creatures.js";

export default function*(){
    let day = 1;
    let xp = 0;
    let gold = 0;
    let armory = [];
    let stock = [];
    let equipment = new Map([["body", "leather"]]);
    
    while(true){
        while(true){
            const options = ["もぐる", "そうび", ...(day >= 3 ? ["おみせ"] : [])];
            const cmd = yield [`${day}にちめ レベル${level(xp)} ${gold ? "$" + gold : ""}`, ...options];
            
            if(cmd === 1) break; //expedition
            if(cmd === 2){ //equip
                for(let type of ["primary", "secondary", "head", "body", "feet"].filter(t => equipment.has(t) || armory.some(g => gear(g).type === t))){
                        
                    const options = [...(equipment.has(type) ? [equipment.get(type)] : []), ...armory.filter(g => gear(g).type === type)];
                    const eqp = yield [label(type) + "：", ...options.map((g, i) => (equipment.has(type) && i === 0 ? "E" : "") + describe(g)), "そうびしない"];
                    
                    tryPush(armory, equipment.get(type));
                    if(eqp === options.length + 1){
                        equipment.delete(type);
                    }else{
                        equipment.set(type, options[eqp - 1]);
                        armory.splice(armory.indexOf(options[eqp - 1]), 1);
                    }
                }
            }
            
            if(cmd === 3){ //shop
                while(true){
                    const c = yield [`いらっしゃい`, "かう", "うる", "さよなら"];
                    if(c === 3) break;
                    if(c === 1){
                        const d = yield [`どれをかう？ $${gold}`, ...stock.map(g => `$${gear(g).value} ` + describe(g)), "やめとく"];
                        if(d <= stock.length){
                            if(gold < gear(stock[d - 1]).value) yield [`おかねがたりないよ`, "つづける"];
                            else{
                                gold -= gear(stock[d - 1]).value;
                                armory.push(...stock.splice(d - 1, 1));
                                yield [`まいどあり`, "つづける"];
                            }
                        }
                    }
                    if(c === 2){
                        const d = yield [`どれをうる？`, ...armory.map(g =>`$${gear(g).value / 2 | 0} ${describe(g)}`), ...(armory.length > 1 ? ["ぜんぶ"] : []), "やめとく"];
                        if(armory.length > 1 && d === armory.length + 1){
                            const gain = stock.map(gear).map(g => g.value / 2 | 0).reduce((a, b) => a + b);
                            gold += gain;
                            armory = [];
                            yield [`ぜんぶで$${gain}になった`, "つづける"]
                        }
                        if(d <= armory.length){
                            const gain = gear(stock[d - 1]).value / 2 | 0;
                            gold += gain;
                            armory.splice(d - 1, 1);
                            yield [`$${gain}でうれた`, "つづける"];
                        }
                    }
                }
            }
        }
        
        let pl = player(xp, equipment);
        let kills = 0;
        
        while(true){
            let enemy = {...orc, effects:[]};
            yield [enemy.label + "がおそってきた！", "たたかう"];
            
            while(pl.hp > 0){
                pl.effects = wear(pl.effects);
                
                let cmd = yield [stats(pl) + `\nてき：${enemy.label}`, "なぐる", "かいふく", "いなずま", "ぼうぎょ"];
                if(cmd === 1){
                    const dmg = round(attack(...pl.damage) * multiplier(pl.effects, "damage"));
                    enemy.hp -= dmg;
                    pl.effects.push(...pl.onAttack.filter(e => !["sdamage", "sheal"].includes(e.type)));
                    yield [`ぽかっすかっ！${dmg}のダメージ！${enemy.hp > 0 ? "" : enemy.label + "はうごかなくなった！"}`, "つづける"];
                }else if(cmd === 2){
                    const rst = round((rnd(3, 8) + sum(pl.onHeal, "sheal")) * multiplier(pl.effects, "spell"));
                    pl.hp = Math.min(maxHp(pl), pl.hp + rst);
                    
                    const dmg = round(multiplier(pl.effects, "spell") * sum(pl.onHeal, "sdamage"));
                    enemy.hp -= dmg;
                    
                    pl.effects.push({type: "spell", amount: -0.25, duration: 3},{type: "hp", amount: -0.04, duration: Infinity});
                    pl.effects.push(...pl.onHeal.filter(e => !["sdamage", "sheal"].includes(e.type)));

                    let msg = dmg ? `\nさらに${dmg}のダメージをあたえた！` : "";
                    if(enemy.hp <= 0) msg += `${enemy.label}はしなびきった！`;

                    yield [`いたいのとんでけ！${rst}のたいりょくをかいふく！${msg}`, "つづける"];
                }else if(cmd === 3){
                    const dmg = round((6 + sum(pl.onBolt, "sdamage")) * multiplier(pl.effects, "spell"));
                    enemy.hp -= dmg;
                    pl.effects.push({type: "spell", amount: -0.25, duration: 4});
                    pl.effects.push(...pl.onBolt.filter(e => !["sdamage", "sheal"].includes(e.type)));
                    yield [`ニンポをつかうぞ！${dmg}のダメージ！${enemy.hp > 0 ? "" : enemy.label + "はうごかなくなった！"}`, "つづける"];
                }else if(cmd === 4){
                    pl.effects.push({type: "dodge", amount: 0.5, duration: 2});
                    pl.effects.push(...pl.onParry.filter(e => !["sdamage", "sheal"].includes(e.type)));
                    yield ["みがまえて こうげきをかわしやすくなった！", "つづける"];
                }
                if(enemy.hp <= 0 || pl.hp <= 0) break;
                
                if(Math.random() > sum(pl.effects, "dodge", 0.75)){
                    const dmg = pickRnd(enemy.damage);
                    pl.hp -= dmg;
                    yield [`がすっ！${dmg}のダメージをうけた！${pl.hp > 0 ? "" : "やられてしまった！"}`, "つづける"];
                }else{
                    pl.effects.push(...pl.onDodge);
                    yield [`ひらり！こうげきをかわした！`, "つづける"];
                }
            }
            
            if(pl.hp <= 0) return [`しんでしまった..`];
            
            ++kills;        
            const cmd = yield ["たたかいはおわった！", "すすむ", "もどる"];
            if(cmd === 2) break;
            
            pl.hp = Math.min(maxHp(pl), pl.hp + round(maxHp(pl) * 0.25));
            pl.effects = wear(pl.effects);
        }
        
        const xpGained = kills;
        yield [`ぶじにかえってきた..\n${kills}たいのてきをたおし ${xpGained}のけいけんをえた${level(xp) < level(xp + xpGained) ? "\nレベルがあがった！" : ""}`, "つづける"];
        xp += xpGained;
        ++day;
        if(kills >= 3){
            const l = loot();
            armory.push(l.name);
            yield [`こんかいの ぶんどりひん：${l.label}`, "つづける"];
        }
        
        const m = loot();
        if(!stock.includes(m.name) && !armory.includes(m.name) && ![...equipment.values()].includes(m.name))
            stock.push(m.name);
        stock = stock.slice(-3);
    }
}