function getUiSpxData(name){
    var data;
    switch(name)
    {
        case "btn":
            data = new Array( "/ui/btn.png"
              ,4/* tile count */,0/* has mask */
                ,0,0,36,28 /* t_0 */  ,0,28,36,28 /* t_1 */  ,36,0,36,28 /* t_2 */  ,36,28,36,28 /* t_3 */  
              ,4/*frm count 4*/
                /*frm:0*/,1,1,0,0,0,0,36,28
                    /*tile count:1*/,0,0,0,0/*t0*/
                    /*rect count:1*/,0,0,36,28/*r0*/
                /*frm:1*/,1,1,0,0,0,0,36,28
                    /*tile count:1*/,2,0,0,0/*t0*/
                    /*rect count:1*/,0,0,36,28/*r0*/
                /*frm:2*/,1,1,0,0,0,0,36,28
                    /*tile count:1*/,1,0,0,0/*t0*/
                    /*rect count:1*/,0,0,36,28/*r0*/
                /*frm:3*/,1,1,0,0,0,0,36,28
                    /*tile count:1*/,3,0,0,0/*t0*/
                    /*rect count:1*/,0,0,36,28/*r0*/
              ,8/*act count 8*/
                /*act:0*/,1,0,0
                    /*sqe count:1*/,0
                /*act:1*/,1,0,0
                    /*sqe count:1*/,1
                /*act:2*/,0,0,0
                /*act:3*/,0,0,0
                /*act:4*/,1,0,0
                    /*sqe count:1*/,2
                /*act:5*/,1,0,0
                    /*sqe count:1*/,3
                /*act:6*/,0,0,0
                /*act:7*/,0,0,0

            );
            break;
        case "cannon":
            data = new Array( "/ui/cannon.png"
              ,7/* tile count */,0/* has mask */
                ,88,58,69,57 /* t_0 */  ,88,0,69,58 /* t_1 */  ,82,115,70,58 /* t_2 */  ,78,173,76,61 /* t_3 */  ,0,136,78,63 /* t_4 */  
                ,0,69,82,67 /* t_5 */  ,0,0,88,69 /* t_6 */  
              ,7/*frm count 7*/
                /*frm:0*/,1,0,0,0,-30,-28,39,29
                    /*tile count:1*/,0,-30,-28,0/*t0*/
                /*frm:1*/,1,0,0,0,-30,-29,39,29
                    /*tile count:1*/,1,-30,-29,0/*t0*/
                /*frm:2*/,1,0,0,0,-30,-28,40,30
                    /*tile count:1*/,2,-30,-28,0/*t0*/
                /*frm:3*/,1,0,0,0,-32,-30,44,31
                    /*tile count:1*/,3,-32,-30,0/*t0*/
                /*frm:4*/,1,0,0,0,-33,-31,45,32
                    /*tile count:1*/,4,-33,-31,0/*t0*/
                /*frm:5*/,1,0,0,0,-35,-33,47,34
                    /*tile count:1*/,5,-35,-33,0/*t0*/
                /*frm:6*/,1,0,0,0,-36,-34,52,35
                    /*tile count:1*/,6,-36,-34,0/*t0*/
              ,7/*act count 7*/
                /*act:0*/,1,0,0
                    /*sqe count:1*/,0
                /*act:1*/,1,0,0
                    /*sqe count:1*/,1
                /*act:2*/,1,0,0
                    /*sqe count:1*/,2
                /*act:3*/,1,0,0
                    /*sqe count:1*/,3
                /*act:4*/,1,0,0
                    /*sqe count:1*/,4
                /*act:5*/,1,0,0
                    /*sqe count:1*/,5
                /*act:6*/,1,0,0
                    /*sqe count:1*/,6

            );
            break;
        case "game_ui":
            data = new Array( "/ui/game_ui.png"
              ,1/* tile count */,0/* has mask */
                ,0,0,712,70 /* t_0 */  
              ,1/*frm count 1*/
                /*frm:0*/,1,0,5,0,28,410,740,480
                    /*tile count:1*/,0,28,410,0/*t0*/
                    /*rect count:5*/,400,461/*p0*/,450,449/*p1*/,318,449/*p2*/,44,458/*p3*/,94,454/*p4*/
              ,1/*act count 1*/
                /*act:0*/,1,0,0
                    /*sqe count:1*/,0

            );
            break;
    }
    return data;
}