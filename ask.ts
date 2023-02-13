import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts"
import { Configuration, OpenAIApi } from "npm:openai";

const key = await Deno.readTextFileSync(Deno.env.get("HOME") + "/.openapikey");
const configuration = new Configuration({
  apiKey: key
});
const openai = new OpenAIApi(configuration);

async function main() {
  await new Command()
    .name("gpt")
    .description("ask text-davinci-003.")
    .version("v0.0.1")
    .option("-i, --input <filepath>", "filepath to input as an prompt.")
    .option("-t, --translation <language>", "translation to the given language.")
    .option("-s, --style <style>", "translation style.")
    .action(async (opts) => {
      let toask = "";
      if (opts.input) {
        toask = Deno.readTextFileSync(opts.input);
      } else {
        toask = prompt("Enter the prompt:") ?? "";
        if (toask === "") {
          return;
        }
        if (opts.translation) {
          let translationPrompt = `Translate the following text to ${opts.translation}`;
          if (opts.style) {
            translationPrompt += `in ${opts.style} style`
          }
          toask = `${translationPrompt}. Text: ${toask}`;
        }
      }

      console.log("asking...");
      const response = await askGPT(toask);
      console.log(response);
    }).parse();
}

async function askGPT(prompt: string): Promise<string> {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.3,
    max_tokens: 2048,
  });

  return response.data.choices[0].text ?? "ERROR";
}

main();