/*
Copyright (c) 2021, Oscar Chavarro (jedilink@gmail.com)
This code is closed source / propertary. Do not redistribute.
DISPLAIMER: Use AS IS, author is not responsible of any damages
caused by the misuse of this software.
*/

export class Formatter {
    private static zeroPad(n: number): string {
        return ('0' + n).slice(-2);
    }

    public static value(v: number): string {
        return v.toFixed(5).substring(0, 7);
    }

    public static float(n: number, k: number): string {
        if (!k) {
            k = 2;
        }
        let power = 10;
        for (let p = 0; p < k; p++) {
            power = power * 100;
        }
        return (Math.round(n * power) / power).toFixed(k);
    }

    public static date(d: Date): string {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[d.getMonth()]
            + ' ' + Formatter.zeroPad(d.getDate()) // getDay() is the day of the week (6 is saturday)
            + ' ' + Formatter.zeroPad(d.getHours()) + ':'
            + Formatter.zeroPad(d.getMinutes()) + ':'
            + Formatter.zeroPad(d.getSeconds());
    }

    public static hourMinuteSecond(d: Date): string {
        return Formatter.zeroPad(d.getHours()) + ':'
            + Formatter.zeroPad(d.getMinutes()) + ':'
            + Formatter.zeroPad(d.getSeconds());
    }

    public static hourMinute(d: Date): string {
        return Formatter.zeroPad(d.getHours()) + ':'
            + Formatter.zeroPad(d.getMinutes());
    }    

    public static deltaTime(t: number): string {
        const minutes = Math.floor(t / 60);
        const hours = Math.floor(t / 3600);
        if (t < 60) {
            return '' + t + ' seconds';
        } else if (t < 3600) {
            return '' + minutes + 'min : ' + (t % 60) + 'sec';
        }
        return '' + hours + 'h : ' + (minutes - hours * 60) + 'min : ' + (t % 60) + 'sec';
    }
}
