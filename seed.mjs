import fs from 'fs';
import path from 'path';

// Generate data.json
const globalContests = [];
const WEEKLIES = 491;
const BIWEEKLIES = 177;

// Weekly 492 is Mar 8, 2026, 08:00 GMT+05:30 -> Weekly 491 is Sun Mar 01 2026
const weekly491Date = new Date('2026-03-01T08:00:00+05:30');
for (let i = 1; i <= WEEKLIES; i++) {
    const diffWeeks = WEEKLIES - i;
    const date = new Date(weekly491Date.getTime() - diffWeeks * 7 * 24 * 60 * 60 * 1000);
    globalContests.push({
        id: `weekly-${i}`,
        title: `Weekly Contest ${i}`,
        type: 'Weekly',
        date: date.toISOString(),
        contestNumber: i,
        url: `https://leetcode.com/contest/weekly-contest-${i}/`
    });
}

// Biweekly 177 is Sat Feb 28 2026
const biweekly177Date = new Date('2026-02-28T20:00:00+05:30');
for (let i = 1; i <= BIWEEKLIES; i++) {
    const diffBiweeks = BIWEEKLIES - i;
    const date = new Date(biweekly177Date.getTime() - diffBiweeks * 14 * 24 * 60 * 60 * 1000);
    globalContests.push({
        id: `biweekly-${i}`,
        title: `Biweekly Contest ${i}`,
        type: 'Biweekly',
        date: date.toISOString(),
        contestNumber: i,
        url: `https://leetcode.com/contest/biweekly-contest-${i}/`
    });
}

globalContests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
fs.writeFileSync(path.join(process.cwd(), 'data.json'), JSON.stringify({ contests: globalContests, questions: [] }, null, 2));
console.log(`Generated data.json with ${globalContests.length} global contests.`);

const userContests = [];
const userQuestions = [];

const historyText = `Weekly Contest 491
Sun, Mar 1, 08:00 GMT+05:30
2 / 4
Rank 907900:15:17
Weekly Contest 490
Sun, Feb 22, 08:00 GMT+05:30
3 / 4
Rank 1099001:12:40
Weekly Contest 487
Sun, Feb 1, 08:00 GMT+05:30
2 / 4
Rank 1398901:01:32
Weekly Contest 486
Sun, Jan 25, 08:00 GMT+05:30
3 / 4
Rank 638801:08:46
Weekly Contest 484
Sun, Jan 11, 08:00 GMT+05:30
3 / 4
Rank 586400:53:59
Weekly Contest 481
Sun, Dec 21, 2025, 08:00 GMT+05:30
2 / 4
Rank 908400:27:12
Weekly Contest 477
Sun, Nov 23, 2025, 08:00 GMT+05:30
1 / 4
Rank 920100:07:15
Weekly Contest 476
Sun, Nov 16, 2025, 08:00 GMT+05:30
2 / 4
Rank 829100:14:11
Weekly Contest 491 banner
Weekly Contest 491
Sun, Mar 1, 08:00 GMT+05:30
2 / 4
Biweekly Contest 177 banner
Biweekly Contest 177
Sat, Feb 28, 20:00 GMT+05:30
0 / 4
Weekly Contest 490 banner
Weekly Contest 490
Sun, Feb 22, 08:00 GMT+05:30
3 / 4
Weekly Contest 489 banner
Weekly Contest 489
Sun, Feb 15, 08:00 GMT+05:30
0 / 4
Biweekly Contest 176 banner
Biweekly Contest 176
Sat, Feb 14, 20:00 GMT+05:30
0 / 4
Weekly Contest 488 banner
Weekly Contest 488
Sun, Feb 8, 08:00 GMT+05:30
0 / 4
Weekly Contest 487 banner
Weekly Contest 487
Sun, Feb 1, 08:00 GMT+05:30
2 / 4
Biweekly Contest 175 banner
Biweekly Contest 175
Sat, Jan 31, 20:00 GMT+05:30
0 / 4
Weekly Contest 475
Sun, Nov 9, 2025, 08:00 GMT+05:30
1 / 4
Rank 1388500:12:06
Weekly Contest 472
Sun, Oct 19, 2025, 08:00 GMT+05:30
2 / 4
Rank 997200:57:02
Weekly Contest 470
Sun, Oct 5, 2025, 08:00 GMT+05:30
1 / 4
Rank 1291100:01:42
Weekly Contest 469
Sun, Sep 28, 2025, 08:00 GMT+05:30
1 / 4
Rank 1042800:12:27
Weekly Contest 468
Sun, Sep 21, 2025, 08:00 GMT+05:30
2 / 4
Rank 460100:07:56
Weekly Contest 467
Sun, Sep 14, 2025, 08:00 GMT+05:30
2 / 4
Rank 562500:08:03
Biweekly Contest 165
Sat, Sep 13, 2025, 20:00 GMT+05:30
1 / 4
Rank 1050000:17:57
Weekly Contest 466
Sun, Sep 7, 2025, 08:00 GMT+05:30
2 / 4
Rank 689300:20:44
Weekly Contest 461
Sun, Aug 3, 2025, 08:00 GMT+05:30
2 / 4
Rank 714900:36:19
Weekly Contest 460
Sun, Jul 27, 2025, 08:00 GMT+05:30
1 / 4
Rank 1804301:06:05
Weekly Contest 459
Sun, Jul 20, 2025, 08:00 GMT+05:30
2 / 4
Rank 462300:38:12
Weekly Contest 457
Sun, Jul 6, 2025, 08:00 GMT+05:30
1 / 4
Rank 1307100:48:14
Weekly Contest 456
Sun, Jun 29, 2025, 08:00 GMT+05:30
1 / 4
Rank 1006100:18:02
Weekly Contest 451
Sun, May 25, 2025, 08:00 GMT+05:30
2 / 4
Rank 605900:38:34
Biweekly Contest 157
Sat, May 24, 2025, 20:00 GMT+05:30
1 / 4
Rank 1025900:52:33
Weekly Contest 450
Sun, May 18, 2025, 08:00 GMT+05:30
2 / 4
Rank 727300:45:27
Weekly Contest 446
Sun, Apr 20, 2025, 08:00 GMT+05:30
2 / 4
Rank 1056801:02:19
Weekly Contest 445
Sun, Apr 13, 2025, 08:00 GMT+05:30
1 / 4
Rank 1563400:04:55
Biweekly Contest 154
Sat, Apr 12, 2025, 20:00 GMT+05:30
1 / 4
Rank 1205600:07:01
Weekly Contest 444
Sun, Apr 6, 2025, 08:00 GMT+05:30
1 / 4
Rank 1183100:40:57
Weekly Contest 443
Sun, Mar 30, 2025, 08:00 GMT+05:30
1 / 4
Rank 1418900:21:32
Weekly Contest 442
Sun, Mar 23, 2025, 08:00 GMT+05:30
1 / 4
Rank 1263900:04:31
Weekly Contest 441
Sun, Mar 16, 2025, 08:00 GMT+05:30
0 / 4
Rank 2347600:00:00
Biweekly Contest 152
Sat, Mar 15, 2025, 20:00 GMT+05:30
1 / 4
Rank 1665300:45:02
Weekly Contest 440
Sun, Mar 9, 2025, 08:00 GMT+05:30
1 / 4
Rank 1000400:12:54
Weekly Contest 439
Sun, Mar 2, 2025, 08:00 GMT+05:30
1 / 4
Rank 1147000:40:14
Biweekly Contest 151
Sat, Mar 1, 2025, 20:00 GMT+05:30
1 / 4
Rank 1222400:01:35
Weekly Contest 438
Sun, Feb 23, 2025, 08:00 GMT+05:30
2 / 4
Rank 1222101:01:25
Biweekly Contest 150
Sat, Feb 15, 2025, 20:00 GMT+05:30
1 / 4
Rank 1762900:24:34
Biweekly Contest 149
Sat, Feb 1, 2025, 20:00 GMT+05:30
1 / 4
Rank 1548900:24:42
Weekly Contest 416
Sun, Sep 22, 2024, 08:00 GMT+05:30
1 / 4
Rank 2359501:53:18
Biweekly Contest 139
Sat, Sep 14, 2024, 20:00 GMT+05:30
1 / 4
Rank 1884500:13:19
Biweekly Contest 137
Sat, Aug 17, 2024, 20:00 GMT+05:30
1 / 4
Rank 1897200:38:12
Weekly Contest 409
Sun, Aug 4, 2024, 08:00 GMT+05:30
0 / 4
Rank 3336100:00:00
Biweekly Contest 136
Sat, Aug 3, 2024, 20:00 GMT+05:30
1 / 4
Rank 2389900:30:39
Weekly Contest 408
Sun, Jul 28, 2024, 08:00 GMT+05:30
1 / 4
Rank 2247300:27:03
Biweekly Contest 118
Sat, Nov 25, 2023, 20:00 GMT+05:30
1 / 4
Rank 1319401:08:39`;

const lines = historyText.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Ignore purely banner strings to prevent duplicates
    if (line.includes('banner')) continue;

    if (line.match(/^(Weekly|Biweekly) Contest \d+$/)) {
        const titleMatch = line.match(/^(Weekly|Biweekly) Contest (\d+)$/);
        const type = titleMatch[1];
        const num = parseInt(titleMatch[2], 10);
        const contestId = type.toLowerCase() + '-' + num;

        // Skip parsing if we are somehow looking ahead too far (prevent bounds error)
        if (i + 1 >= lines.length) continue;

        const fractionLine = lines.find((l, idx) => idx > i && idx < i + 4 && l.includes('/ 4'));
        let solved = 0;
        if (fractionLine) {
            solved = parseInt(fractionLine.split('/')[0].trim(), 10);
        }

        let rank = undefined;
        let completionTime = undefined;
        const rankLine = lines.find((l, idx) => idx > i && idx < i + 5 && l.startsWith('Rank'));

        if (rankLine) {
            // Match for example: "Rank 1319401:08:39"
            // The time string is usually `XX:YY:ZZ` which is 8 chars, maybe the preceding string is the rank
            // The regex matching digits followed by `\d{2}:\d{2}:\d{2}`.
            const rm = rankLine.match(/^Rank\s*(\d+)(\d{2}:\d{2}:\d{2})$/);
            if (rm) {
                rank = parseInt(rm[1], 10);
                completionTime = rm[2];
            } else {
                // Fallback if no time is attached (e.g. from the previous test string format)
                const normalMatch = rankLine.match(/^Rank\s*(\d+)$/);
                if (normalMatch) rank = parseInt(normalMatch[1], 10);
            }
        }

        if (rank !== undefined && !userContests.find(c => c.contestId === contestId)) {
            userContests.push({
                contestId,
                rank,
                rating: null,
                attended: true,
                questionsSolved: solved
            });

            if (solved > 0) {
                for (let j = 1; j <= solved; j++) {
                    let diff = 'Easy';
                    if (j === 2) diff = 'Medium';
                    if (j >= 3) diff = 'Medium';
                    if (j === 4) diff = 'Hard';

                    userQuestions.push({
                        id: Math.random().toString(36).substr(2, 9),
                        contestId,
                        title: `Question ${j} from ${titleMatch[0]}`,
                        difficulty: diff,
                        topics: ['General'],
                        solvedDuringContest: true,
                        dateSolved: new Date().toISOString()
                    });
                }
            }
        }
    }
}

fs.writeFileSync(path.join(process.cwd(), 'user.json'), JSON.stringify({ contests: userContests, questions: userQuestions }, null, 2));
console.log(`Generated user.json with ${userContests.length} user contests.`);
