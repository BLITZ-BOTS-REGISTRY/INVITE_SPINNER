import {
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    GuildMember,
    SlashCommandBuilder,
  } from "npm:discord.js";
  
  export default {
    data: new SlashCommandBuilder()
      .setName("invite-spin")
      .setDescription("Spin the invites wheel"),
    action: async (client: Client, interaction: ChatInputCommandInteraction, config: { chance: string }) => {
      const guild = interaction.guild;
      if (!guild) {
        return interaction.reply("This command can only be used in a server.");
      }
  
      await interaction.deferReply();
  
      const invites = client.inviteManager.getMemberInvites(
        `${interaction.guild?.id}`,
        interaction.user
      );
  
      if (invites < 1) {
        return interaction.editReply({
          content: `You need at least **1** invite to spin the wheel!`,
          ephemeral: true,
        });
      }
  
      // Hardcoded win chance percentage
      const winChance = Number(config.chance)
  
      // Simulated spinning animation
      const spinStages = [
        "Spinning... \ud83c\udf00",
        "Spinning... \ud83c\udf88",
        "Spinning... \ud83c\udf89",
        "Spinning... \ud83c\udf88",
        "Spinning... \ud83c\udf00",
      ];
  
      for (const stage of spinStages) {
        await interaction.editReply({ content: stage });
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
      }
  
      // Determine win or lose
      const isWinner = Math.random() * 100 < winChance;
  
      // Deduct 1 invite
      client.inviteManager.inviteRemove(`${interaction.guild?.id}`, interaction.user, 1);
  
      // Send result
      if (isWinner) {
        return interaction.editReply({
          content: `\ud83c\udf89 Congratulations! You won the spin! \ud83c\udf89`,
        });
      } else {
        return interaction.editReply({
          content: `\ud83d\ude14 Better luck next time! You didn't win this spin.`,
        });
      }
    },
  };
  