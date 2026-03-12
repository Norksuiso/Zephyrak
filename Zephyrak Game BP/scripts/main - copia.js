import { world, system } from "@minecraft/server";

system.run(() => {
    world.sendMessage("§aScript funcionando correctamente!");
});

system.runInterval(() => {

    for (const player of world.getPlayers()) {

        const velocity = player.getVelocity();

        // Si el jugador está subiendo (salto)
        if (velocity.y > 0.3) {

            const dimension = player.dimension;
            const location = player.location;

            dimension.spawnEntity("minecraft:xp_bottle", location);
            player.addEffect("minecraft:jump_boost", 90, {
                amplifier: 20,
                showParticles: true
            });
        }
    }

}, 2);

world.afterEvents.playerBreakBlock.subscribe((event) => {

    const player = event.player;
    const block = event.block;

    const dimension = player.dimension;
    const location = block.location;

    dimension.spawnEntity("minecraft:xp_orb", location);

});

world.afterEvents.entityHurt.subscribe((event) => {

    const attacker = event.damageSource.damagingEntity;
    const victim = event.hurtEntity;

    // Si quien golpeó fue un jugador
    if (attacker && attacker.typeId === "minecraft:player") {

        victim.addEffect("minecraft:blindness", 100, {
            amplifier: 0,
            showParticles: true
        });
    }

});