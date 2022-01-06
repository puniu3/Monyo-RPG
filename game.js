import {round, rnd, attack, pickRnd, sum, multiplier, maxHp, xpTable, level, gearEffects, gear, name2Desc, wear, stats, type2Label, weaponDmg} from "./utils.js";
import {orc} from "./creatures.js";

export default function*(){
    let xp = 0;
    let armory = ["plate", "robe", "helm", "hat", "sword"];
    let equipment = new Map([["body", "leather"]]);
    
    while(true){
        let pl = {
            maxHp: level(xp) + 9,
            effects: gearEffects(equipment),
            damage: weaponDmg(equipment),
            skills:["なぐる", "かいふく", "いなずま", "ぼうぎょ"]
        };
        pl.hp = maxHp(pl);
        
        let kills = 0;
        
        while(true){
            let enemy = {...orc, effects:[]};
            yield [enemy.label + "がおそってきた！", "たたかう"];
            
            while(pl.hp > 0){
                pl.effects = wear(pl.effects);
                
                let cmd = yield [stats(pl) + `\nてき：${enemy.label}`, ...pl.skills];
                const act = pl.skills[cmd - 1];
                if(act === "なぐる"){
                    const dmg = attack(...pl.damage, 2);
                    enemy.hp -= dmg;
                    yield [`ぽかっすかっ！${dmg}のダメージ！${enemy.hp > 0 ? "" : enemy.label + "はうごかなくなった！"}`, "つづける"];
                }else if(act === "かいふく"){
                    const rst = round(rnd(3, 8) * multiplier(pl.effects, "spell"));
                    pl.hp = Math.min(maxHp(pl), pl.hp + rst);
                    pl.effects.push({type: "spell", amount: -0.25, duration: 3},{type: "hp", amount: -0.04, duration: Infinity});
                    yield [`いたいのとんでけ！${rst}のたいりょくをかいふく！`, "つづける"];
                }else if(act === "いなずま"){
                    const dmg = round(6 * multiplier(pl.effects, "spell"));
                    enemy.hp -= dmg;
                    pl.effects.push({type: "spell", amount: -0.25, duration: 4});
                    yield [`ニンポをつかうぞ！${dmg}のダメージ！${enemy.hp > 0 ? "" : enemy.label + "はうごかなくなった！"}`, "つづける"];
                }else if(act === "ぼうぎょ"){
                    pl.effects.push({type: "dodge", amount: 0.5, duration: 2});
                    yield ["みがまえて こうげきをかわしやすくなった！", "つづける"];
                }
                if(enemy.hp <= 0 || pl.hp <= 0) break;
                
                if(Math.random() > sum(pl.effects, "dodge", 0.85)){
                    const dmg = pickRnd(enemy.damage);
                    pl.hp -= dmg;
                    yield [`がすっ！${dmg}のダメージをうけた！${pl.hp > 0 ? "" : "やられてしまった！"}`, "つづける"];
                }else{
                    yield [`ひらり！こうげきをかわした！`, "つづける"];
                }
            }
            
            if(pl.hp <= 0) return [`しんでしまった.. たおしたてき：${kills}`];
            
            ++kills;        
            const cmd = yield ["たたかいはおわった！", "すすむ", "もどる"];
            if(cmd === 2) break;
            
            pl.hp = Math.min(maxHp(pl), pl.hp + round(maxHp(pl) * 0.25));
            pl.effects = wear(pl.effects);
        }
        
        const xpGained = xpTable[kills] || xpTable[xpTable.length - 1];
        yield [`ぶじにかえってきた..\n${kills}たいのてきをたおし ${xpGained}のけいけんをえた${level(xp) < level(xp + xpGained) ? "\nレベルがあがった！" : ""}`, "つづける"];
        xp += xpGained;
        
        let cmd;
        while(cmd !== 1){
            cmd = yield [`レベル：${level(xp)}`, "もぐる", "そうび"];
            
            if(cmd === 2){
                for(let type of ["primary", "secondary", "head", "body", "feet"]){
                    if(!equipment.has(type) && armory.every(g => gear(g).type !== type))
                        continue;
                    const options =  [...armory.filter(g => gear(g).type === type)];
                    if(equipment.has(type)) options.unshift(equipment.get(type));
                    const eqp = yield [type2Label(type) + "：", ...options.map((g, i) => (equipment.has(type) && i === 0 ? "E" : "") + name2Desc(g)), "そうびしない"];
                    
                    if(equipment.has(type)) armory.push(equipment.get(type));
                    equipment.delete(type);
                    if(eqp === options.length + 1) continue;
                    equipment.set(type, options[eqp - 1]);
                    const idx = armory.indexOf(options[eqp - 1]);
                    armory.splice(idx, 1);
                }
            }
        }
    }
}