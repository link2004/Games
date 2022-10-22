const UP = 38, DOWN = 40, RIGHT = 39, LEFT = 37;
MAX_ANIMCOUNT = 5;
END_TIME = 30;
anim_count = 0;
isMoving = false;
isRunning = false;
isTimeAttack = true;

class Cell {
    constructor(state) {
        this.state = state;//マスの数値の状態
        this.direction = 0;//今動いている方向
    }

    getAnimX() {
        switch (this.direction) {
            case RIGHT:
                return anim_count / MAX_ANIMCOUNT;
            case LEFT:
                return -anim_count / MAX_ANIMCOUNT;
            default:
                return 0;
        }
    }

    getAnimY() {
        switch (this.direction) {
            case DOWN:
                return anim_count / MAX_ANIMCOUNT;
            case UP:
                return -anim_count / MAX_ANIMCOUNT;
            default:
                return 0;
        }
    }
}


var mapC = [[], [], [], []];

var map = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]

function init_mapC() {
    isMoving = false;
    anim_count = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            mapC[i][j] = new Cell(map[i][j]);
        }
    }
}

function step_mapC() {
    if (isMoving) {
        anim_count += 1;
        if (anim_count > MAX_ANIMCOUNT) init_mapC();
    }
}


function check_end() {
    if (get_time()>=END_TIME && isTimeAttack) return 1;
    //RIGHT
    for (let i = 0; i < 4; i++) {
        for (let j = 3; j > 0; j--) {
            if (map[i][j] == 0 && map[i][j - 1] != 0) return 0;
            else if (map[i][j] == map[i][j - 1]) return 0;
        }
    }
    //LEFT
    for (let i = 0; i < 4; i++) {
        for (let j = 30; j < 3; j++) {
            if (map[i][j] == 0 && map[i][j + 1] != 0) return 0;
            else if (map[i][j] == map[i][j + 1]) return 0;
        }
    }
    //DOWN
    for (let j = 0; j < 4; j++) {
        for (let i = 3; i > 0; i--) {
            if (map[i][j] == 0 && map[i - 1][j] != 0) return 0;
            else if (map[i][j] == map[i - 1][j]) return 0;
        }
    }
    //UP
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 3; i++) {
            if (map[i][j] == 0 && map[i + 1][j] != 0) return 0;
            else if (map[i][j] == map[i + 1][j]) return 0;
        }
    }
    return 1;
}

function getRandInt(max) {
    return Math.floor(Math.random() * max);
}


function init_map() {
    let count = 0;
    for (let i = 0; i < 4; i++)for (let j = 0; j < 4; j++)map[i][j] = 0;
    while (count < 3) {
        let i = getRandInt(4);
        let j = getRandInt(4);
        console.log(i, j);
        if (map[i][j] == 0) {
            if (getRandInt(4) == 0)
                map[i][j] = 2;
            else
                map[i][j] = 1;
            count++;
        }
    }
}

function generate(direction) {
    let i,num,count;

    if (getRandInt(3) == 0) num = 2;
    else num = 1;
    for(let j=0,count=0;j<4 && count < 1;j++){
        i = getRandInt(4);
        switch (direction) {
            case RIGHT:
                if (map[i][0] == 0) {map[i][0] = num;count++;}
                break;
            case LEFT:
                if (map[i][3] == 0) {map[i][3] = num;count++;}
                break;
            case DOWN:
                if (map[0][i] == 0) {map[0][i] = num;count++;}
                break;
            case UP:
                if (map[0][i] == 0) {map[3][i] = num;count++;}
                break;
        }
    }
}

function slide(direction) {
    if (isMoving) return;
    isMoving = true;
    anim_count = 0;
    switch (direction) {
        case RIGHT:
            console.log("slide to right");
            for (let i = 0; i < 4; i++) {
                for (let j = 3; j > 0; j--) {
                    //スライド　
                    if (map[i][j] == 0 && map[i][j - 1] != 0) {
                        map[i][j] = map[i][j - 1];    //ずらす
                        map[i][j - 1] = 0;            //ずらしたところを空にする

                        mapC[i][j - 1].direction = RIGHT;
                    }
                    //合体
                    else if (map[i][j] == map[i][j - 1] && map[i][j] != 0) {
                        map[i][j] += 1;
                        map[i][j - 1] = 0;

                        mapC[i][j - 1].direction = RIGHT;
                    }
                }

            }
            break;


        case LEFT:
            console.log("slide to left");
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 3; j++) {
                    //スライド
                    if (map[i][j] == 0 && map[i][j + 1] != 0) {
                        map[i][j] = map[i][j + 1];    //ずらす
                        map[i][j + 1] = 0;            //ずらしたところを空にする

                        mapC[i][j + 1].direction = LEFT;
                    }
                    //合体
                    else if (map[i][j] == map[i][j + 1] && map[i][j] != 0) {
                        map[i][j] += 1;
                        map[i][j + 1] = 0;

                        mapC[i][j + 1].direction = LEFT;
                    }
                }
            }
            break;

        case DOWN:
            console.log("slide to down");
            for (let j = 0; j < 4; j++) {
                for (let i = 3; i > 0; i--) {
                    //スライド
                    if (map[i][j] == 0 && map[i - 1][j] != 0) {
                        map[i][j] = map[i - 1][j];    //ずらす
                        map[i - 1][j] = 0;            //ずらしたところを空にする

                        mapC[i - 1][j].direction = DOWN;
                    }
                    //合体
                    else if (map[i][j] == map[i - 1][j] && map[i][j] != 0) {
                        map[i][j] += 1;
                        map[i - 1][j] = 0;

                        mapC[i - 1][j].direction = DOWN;
                    }
                }
            }
            break;

        case UP:
            console.log("slide to up");
            for (let j = 0; j < 4; j++) {
                for (let i = 0; i < 3; i++) {
                    //スライド
                    if (map[i][j] == 0 && map[i + 1][j] != 0) {
                        map[i][j] = map[i + 1][j];    //ずらす
                        map[i + 1][j] = 0;            //ずらしたところを空にする

                        mapC[i + 1][j].direction = UP;

                    }
                    //合体
                    else if (map[i][j] == map[i + 1][j] && map[i][j] != 0) {
                        map[i][j] += 1;
                        map[i + 1][j] = 0;

                        mapC[i + 1][j].direction = UP;
                    }
                }
            }
            break;
    }
    generate(direction);
    console.table(map);
}

var time0 = 0;
function set_time() {
    time0 = new Date().getTime();
}

function get_time() {
    var time1 = new Date().getTime();
    time = time1 - time0;
    time = Math.floor(time / 10);
    time = time / 100
    return time;
}

function get_score() {
    var score = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            score += 2 ** map[i][j];
        }
    }
    return score / 10;
}


var player = {
    rank: 0,
    name:" ",
    score: 0,
    time: 0
}

var player_list = [player]
console.log(localStorage.getItem("ranking"));
if(localStorage.getItem("ranking")!=null){
    player_list = localStorage.getItem("ranking");
}
function set_ranking(name,score,time){
    player.name = name;
    player.score = score;
    player.time = time;
    for (let i=0;i<player_list.length;i++){
        if(player_list[i].score < player.score){
            player_list.splice(i,0,player);
            player_list = localStorage.setItem("ranking");
            break;
        }
        if(i==player_list.length)player_list.push(player);
    }
}