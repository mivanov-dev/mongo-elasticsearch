import chalk from "chalk";

const log = {
    info: (e: any) => console.log(chalk.greenBright(e)),
    error: (e: any) => console.error(chalk.redBright(e)),
};

export { log };

