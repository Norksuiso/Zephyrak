import { world, system } from "@minecraft/server";

system.run(() => {
    world.sendMessage("§aSistema de Recompensa Funcionando");
});

const mobRewards = {

    "nk:duende_musgoso": { xp: 5, dinero: 2 },
    "minecraft:slime": { xp: 3, dinero: 1 },
    "minecraft:cow": { xp: 12, dinero: 1 },
    "minecraft:warden": { xp: 10000, dinero: 10000 },

};

world.afterEvents.entityDie.subscribe((event) => {

    const entity = event.deadEntity;
    const killer = event.damageSource?.damagingEntity;

    if (!killer) return;
    if (killer.typeId !== "minecraft:player") return;

    const reward = mobRewards[entity.typeId];
    if (!reward) return;

    const xpObj = world.scoreboard.getObjective("xp");
    const dineroObj = world.scoreboard.getObjective("dinero");

    if (!xpObj || !dineroObj) return;

    let xp = xpObj.getScore(killer) ?? 0;
    let dinero = dineroObj.getScore(killer) ?? 0;

    xp += reward.xp;
    dinero += reward.dinero;

    xpObj.setScore(killer, xp);
    dineroObj.setScore(killer, dinero);

    killer.sendMessage(`§a+${reward.xp} XP §6+${reward.dinero} monedas`);

});