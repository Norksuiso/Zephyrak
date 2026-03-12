import { world, system } from "@minecraft/server";

system.run(() => {
    world.sendMessage("§aFuncionando correctamente!");
});

system.runInterval(() => {

    const nivelObj = world.scoreboard.getObjective("nivel");
    const xpObj = world.scoreboard.getObjective("xp");
    const dineroObj = world.scoreboard.getObjective("dinero");
    const staminaObj = world.scoreboard.getObjective("stamina");

    if (!nivelObj || !xpObj || !dineroObj || !staminaObj) return;

    for (const player of world.getPlayers()) {

        const nivel = nivelObj.getScore(player) ?? 0;
        const xp = xpObj.getScore(player) ?? 0;
        const dinero = dineroObj.getScore(player) ?? 0;
        const stamina = staminaObj.getScore(player) ?? 0;

        const xpNecesaria = 10 * (nivel * 5);

        // ---- BARRA DE ESTAMINA ----
        const maxBars = 3;
        const filledBars = Math.floor((stamina / 100) * maxBars);
        const emptyBars = maxBars - filledBars;

        const barra = "●".repeat(filledBars) + "⊹".repeat(emptyBars);

        player.onScreenDisplay.setActionBar(
        `§6✦ ${nivel} §7| §bXP ${xp}/${xpNecesaria} §7| §a$${dinero} §7| §eSTA ${barra}`
        );

    }

}, 20);


system.runInterval(() => {

    const xpObj = world.scoreboard.getObjective("xp");
    const nivelObj = world.scoreboard.getObjective("nivel");

    if (!xpObj || !nivelObj) return;

    for (const player of world.getPlayers()) {

        let xp = xpObj.getScore(player) ?? 0;
        let nivel = nivelObj.getScore(player) ?? 0;

        const xpNecesaria = 10 * (nivel * 3);

        if (xp >= xpNecesaria) {

            nivel += 1;

            nivelObj.setScore(player, nivel);
            xpObj.setScore(player, xp - xpNecesaria);

            player.sendMessage(`§6Subiste a nivel ${nivel}!`);

        }

    }

}, 2);



const ultimoNivel = new Map();

world.afterEvents.playerSpawn.subscribe((event) => {

    const player = event.player;

    const nivelObj = world.scoreboard.getObjective("nivel");
    if (!nivelObj) return;

    const nivel = nivelObj.getScore(player) ?? 0;

    const extraHearts = Math.floor(nivel / 10);

    player.removeEffect("minecraft:health_boost");

    if (extraHearts > 0) {
        player.addEffect("minecraft:health_boost", 999999, {
            amplifier: extraHearts - 1,
            showParticles: false
        });
    }

});




world.afterEvents.entityHurt.subscribe((event) => {

    const attacker = event.damageSource.damagingEntity;

    if (!attacker || attacker.typeId !== "minecraft:player") return;

    const staminaObj = world.scoreboard.getObjective("stamina");

    let stamina = staminaObj.getScore(attacker) ?? 0;

    stamina -= 10;

    if (stamina < 0) stamina = 0;

    staminaObj.setScore(attacker, stamina);

});



system.runInterval(() => {

    const staminaObj = world.scoreboard.getObjective("stamina");
    if (!staminaObj) return;

    for (const player of world.getPlayers()) {

        let stamina = staminaObj.getScore(player) ?? 0;

        // regenerar estamina
        if (stamina < 100) {
            stamina += 4;
            staminaObj.setScore(player, stamina);
        }

        // si la estamina está llena → regeneración de vida
        if (stamina >= 100) {

            player.addEffect("minecraft:regeneration", 40, {
                amplifier: 1,
                showParticles: false
            });

        }

    }

}, 20);