import runAllTests from "../index.test";

/**
 * Execute tests
 */
export default async function executeTests(args: any) {
    if(args.test) {
        runAllTests();
    }
}
