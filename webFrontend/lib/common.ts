/*
Copyright (c) 2021, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

globalPrintAdvance = function (msg: string, l: number): void {
    if (l < 1) {
        process.stdout.write(msg + ':\n0: ');
    } else if (l % 10 == 0) {
        process.stdout.write('.');
        if (l % 100 == 0) {
            process.stdout.write(' ');
            if (l % 1000 == 0) {
                process.stdout.write('\n' + l + ': ');
            }
        }
    }
}
