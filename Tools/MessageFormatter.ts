import { MessageActionRow, MessageButton, MessageButtonStyle, MessageEmbed, MessageSelectMenu } from "discord.js";

export type SelectOption = {label: string, description: string, value: string};
export class MessageFormatter {
  embeds: any[];
  content: string;
  components: MessageActionRow;

  constructor(){
    this.components = new MessageActionRow();
    this.embeds = [];
  }

  setContent(content: string){
    this.content = content;
    return this;
  }

  addEmbedMessage(embed: MessageEmbed): this {
    this.embeds.push(embed);
    return this;
  }

  addButton(label: string, emoji: string, style: MessageButtonStyle, customId: string): this {
    this.components.addComponents(new MessageButton()
      .setLabel(label)
      .setEmoji(emoji)
      .setStyle(style)
      .setCustomId(customId));
    return this;
  }

  addSelectMenu(placeholder: string, options: SelectOption[], customId: string): this {
    this.components.addComponents(new MessageSelectMenu()
      .setOptions(options)
      .setCustomId(customId)
    );
    return this;
  }

  format(): any {
    let finalResult: any = {}
    if (this.embeds.length > 0) finalResult.embeds = this.embeds;
    if (this.components.components.length > 0) finalResult.components = [this.components];
    if (this.content != undefined) finalResult.content = this.content;
    return finalResult;
  }
}