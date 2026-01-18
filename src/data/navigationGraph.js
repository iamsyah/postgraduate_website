/**
 * Manual Navigation Graph Definition
 * 
 * This file contains manually defined nodes and their connections for pathfinding.
 * 
 * Structure:
 * - nodes: Array of node objects with id, x, y, type (nav_room or nav_path)
 * - connections: Array of connection objects with from, to (node IDs)
 * 
 * To add a new node:
 *   {
 *     id: "unique_node_id",
 *     x: 123.45,  // X coordinate in SVG space
 *     y: 678.90,  // Y coordinate in SVG space
 *     type: "nav_room" | "nav_path"
 *   }
 * 
 * To add a connection:
 *   {
 *     from: "node_id_1",
 *     to: "node_id_2"
 *   }
 */

export const navigationNodes = [
  // ============================================
  // GROUND FLOOR NODES
  // ============================================
  
  // ============================================
  // GROUND FLOOR - NAV_PATH NODES
  // ============================================
  {
    id: "nav_path_1",
    x: 1245.55,
    y: 152.4,
    type: "nav_path"
  },
  {
    id: "nav_path_2",
    x: 1206,
    y: 167,
    type: "nav_path"
  },
  {
    id: "nav_path_3",
    x: 1225,
    y: 225,
    type: "nav_path"
  },
  {
    id: "nav_path_4",
    x: 1280.4,
    y: 393.12,
    type: "nav_path"
  },
  {
    id: "nav_path_5",
    x: 1320.35,
    y: 518.04,
    type: "nav_path"
  },
  {
    id: "nav_path_6",
    x: 1357,
    y: 636,
    type: "nav_path"
  },
  {
    id: "nav_path_7",
    x: 1312.7,
    y: 647.52,
    type: "nav_path"
  },
  {
    id: "nav_path_8",
    x: 1265.1,
    y: 659.38,
    type: "nav_path"
  },
  {
    id: "nav_path_9",
    x: 1196.25,
    y: 674.88,
    type: "nav_path"
  },
  {
    id: "nav_path_10",
    x: 1109.55,
    y: 690.38,
    type: "nav_path"
  },
  {
    id: "nav_path_11",
    x: 1018.6,
    y: 694.94,
    type: "nav_path"
  },
  {
    id: "nav_path_12",
    x: 951.45, // TODO: Add coordinate
    y: 694.94, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_13",
    x: 921.7, // TODO: Add coordinate
    y: 694.94, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_14",
    x: 861.35, // TODO: Add coordinate
    y: 693.11, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_15",
    x: 816, // TODO: Add coordinate
    y: 688, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_16",
    x: 730, // TODO: Add coordinate
    y: 668, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_17",
    x: 638, // TODO: Add coordinate
    y: 558, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_18",
    x: 607, // TODO: Add coordinate
    y: 547, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_19",
    x: 491, // TODO: Add coordinate
    y: 488, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_20",
    x: 660.75, // TODO: Add coordinate
    y: 487.95, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_21",
    x: 611, // TODO: Add coordinate
    y: 467, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_22",
    x: 568, // TODO: Add coordinate
    y: 448, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_23",
    x: 679, // TODO: Add coordinate
    y: 393, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_24",
    x: 805, // TODO: Add coordinate
    y: 324, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_25",
    x: 956, // TODO: Add coordinate
    y: 241, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_26",
    x: 1037, // TODO: Add coordinate
    y: 195, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_27",
    x: 1080.65, // TODO: Add coordinate
    y: 177.93, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_28",
    x: 1144, // TODO: Add coordinate
    y: 172, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_29",
    x: 1369, // TODO: Add coordinate
    y: 670, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_30",
    x: 1547, // TODO: Add coordinate
    y: 671, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_31",
    x: 1553, // TODO: Add coordinate
    y: 646, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_32",
    x: 1585, // TODO: Add coordinate
    y: 614, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_33",
    x: 1626, // TODO: Add coordinate
    y: 604, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_34",
    x: 1664, // TODO: Add coordinate
    y: 615, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_35",
    x: 1695, // TODO: Add coordinate
    y: 649, // TODO: Add coordinate
    type: "nav_path"
  }, 
  {
    id: "nav_path_36",
    x: 1701, // TODO: Add coordinate
    y: 695, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_37",
    x: 1674, // TODO: Add coordinate
    y: 740, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_38",
    x: 1627, // TODO: Add coordinate
    y: 758, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_39",
    x: 1579, // TODO: Add coordinate
    y: 745, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_40",
    x: 1549, // TODO: Add coordinate
    y: 707, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_41",
    x: 1626, // TODO: Add coordinate
    y: 516, // TODO: Add coordinate
    type: "nav_path"
  },

  // ============================================
  // GROUND FLOOR - NAV_ROOM NODES
  // ============================================
  {
    id: "nav_room_DropPoint",
    x: 1232, // TODO: Add coordinate
    y: 116, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_He&She",
    x: 1308, // TODO: Add coordinate
    y: 133, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BackEntrance",
    x: 462.7, // TODO: Add coordinate
    y: 427.77, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_SurauMan",
    x: 1203.9, // TODO: Add coordinate
    y: 731.41, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BilikOmarKhayyam",
    x: 1112.01, // TODO: Add coordinate
    y: 747.94, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_SmartClassroom",
    x: 1018.6, // TODO: Add coordinate
    y: 756.03, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_PejabatPascaSiswazah",
    x: 954, // TODO: Add coordinate
    y: 642.96, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_SOC",
    x: 922, // TODO: Add coordinate
    y: 756, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_StudentHub",
    x: 827.35, // TODO: Add coordinate
    y: 570.02, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_IBDAAI",
    x: 1181, // TODO: Add coordinate
    y: 615, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK33",
    x: 670.1, // TODO: Add coordinate
    y: 374.89, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK34",
    x: 795.05, // TODO: Add coordinate
    y: 305.59, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK35",
    x: 946.35, // TODO: Add coordinate
    y: 222.61, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK36",
    x: 1320,
    y: 381,
    type: "nav_room"
  },
  {
    id: "nav_room_BK37",
    x: 1361,
    y: 504,
    type: "nav_room"
  },
  {
    id: "nav_room_evoCity",
    x: 1577,
    y: 597,
    type: "nav_room"
  },
  {
    id: "nav_room_autism",
    x: 1674,
    y: 598,
    type: "nav_room"
  },
  {
    id: "nav_room_Cloud",
    x: 1719,
    y: 704,
    type: "nav_room"
  },
  {
    id: "nav_room_iDACC",
    x: 1627,
    y: 777,
    type: "nav_room"
  },

  // ============================================
  // GROUND FLOOR - NAV_STAIR NODES
  // ============================================
  {
    id: "nav_stair_1_G",
    x: 1327.15, // TODO: Add coordinate
    y: 704.97, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_stair_2_G",
    x: 689, // TODO: Add coordinate
    y: 837, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_stair_3_G",
    x: 517.1, // TODO: Add coordinate
    y: 380.36, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_stair_4_G",
    x: 1172.45, // TODO: Add coordinate
    y: 203.92, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_lift_CS2_G",
    x: 1264, // TODO: Add coordinate
    y: 212, // TODO: Add coordinate
    type: "nav_lift"
  },

  // ============================================
  // 1ST FLOOR NODES
  // ============================================
  
  // ============================================
  // 1ST FLOOR - NAV_PATH NODES
  // ============================================
  // Add your 1st floor path nodes here
  // Example:
  
  {
    id: "nav_path_42",
    x: 1192, // TODO: Add coordinate
    y: 187, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_43",
    x: 1225, // TODO: Add coordinate
    y: 225, // TODO: Add coordinate
    type: "nav_path"
  },
  { 
    id: "nav_path_44",
    x: 1297.4, // TODO: Add coordinate
    y: 450.22, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_45",
    x: 1347, // TODO: Add coordinate
    y: 599, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_46",
    x: 1357.08, // TODO: Add coordinate
    y: 633.22, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_47",
    x: 1369, // TODO: Add coordinate
    y: 670, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_48",
    x: 1442, // TODO: Add coordinate
    y: 669, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_49",
    x: 1322, // TODO: Add coordinate
    y: 683, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_50",
    x: 1277, // TODO: Add coordinate
    y: 695, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_51",
    x: 1200.5, // TODO: Add coordinate
    y: 710.22, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_52",
    x: 1109, // TODO: Add coordinate
    y: 726, // TODO: Add coordinate
    type: "nav_path"
  },    
  {
    id: "nav_path_53",
    x: 1018, // TODO: Add coordinate
    y: 732, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_54",
    x: 922, // TODO: Add coordinate
    y: 732, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_55",
    x: 861.35, // TODO: Add coordinate
    y: 727.44, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_56",
    x: 827, // TODO: Add coordinate
    y: 724.28, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_57",
    x: 759, // TODO: Add coordinate
    y: 715, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_58",
    x: 772, // TODO: Add coordinate
    y: 643, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_59",
    x: 836, // TODO: Add coordinate
    y: 652, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_60",
    x: 904, // TODO: Add coordinate
    y: 660, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_61",
    x: 976, // TODO: Add coordinate
    y: 660, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_62",      
    x: 1047, // TODO: Add coordinate
    y: 657, // TODO: Add coordinate
    type: "nav_path"
  },    
  {
    id: "nav_path_63",
    x: 1113, // TODO: Add coordinate
    y: 649, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_64",
    x: 1246, // TODO: Add coordinate
    y: 624, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_65",
    x: 730, // TODO: Add coordinate
    y: 668, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_66",
    x: 638, // TODO: Add coordinate
    y: 558, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_67",
    x: 607, // TODO: Add coordinate
    y: 547, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_68",
    x: 491, // TODO: Add coordinate
    y: 488, // TODO: Add coordinate
    type: "nav_path"
  },  
  {
    id: "nav_path_69",
    x: 660.75, // TODO: Add coordinate
    y: 487.95, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_70",
    x: 611, // TODO: Add coordinate
    y: 467, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_71",
    x: 568, // TODO: Add coordinate
    y: 448, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_72",
    x: 656, // TODO: Add coordinate
    y: 404, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_73",
    x: 805, // TODO: Add coordinate
    y: 324, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_74",
    x: 956, // TODO: Add coordinate
    y: 241, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_75",
    x: 1037, // TODO: Add coordinate
    y: 195, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_76",
    x: 1080.65, // TODO: Add coordinate
    y: 177.93, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_77",
    x: 1144, // TODO: Add coordinate
    y: 172, // TODO: Add coordinate
    type: "nav_path"
  },

  // ============================================
  // GROUND FLOOR - NAV_ROOM NODES
  // ============================================

  {
    id: "nav_room_GLS",
    x: 1338.63, // TODO: Add coordinate
    y: 437.22, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK20",
    x: 1203.9, // TODO: Add coordinate
    y: 731.41, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK21",
    x: 1112.01, // TODO: Add coordinate
    y: 747.94, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK22",
    x: 1018.6, // TODO: Add coordinate
    y: 756.03, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK23",
    x: 922, // TODO: Add coordinate
    y: 756, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK24",
    x: 838, // TODO: Add coordinate
    y: 631, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK25",
    x: 973.75, // TODO: Add coordinate
    y: 640.68, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK26",
    x: 1111, // TODO: Add coordinate
    y: 631, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK27",
    x: 1241.3, // TODO: Add coordinate
    y: 607.4, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK30",
    x: 946.35, // TODO: Add coordinate
    y: 222.61, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK31",
    x: 795.05, // TODO: Add coordinate
    y: 305.59, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_BK32",
    x: 648, // TODO: Add coordinate
    y: 387, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_DK2",
    x: 594.45, // TODO: Add coordinate
    y: 580.96, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_DK3",
    x: 474.17, // TODO: Add coordinate
    y: 523.06, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_HEP",
    x: 1524, // TODO: Add coordinate
    y: 671, // TODO: Add coordinate
    type: "nav_room"
  },

  // ============================================
  // 1ST FLOOR - NAV_STAIR NODES
  // ============================================
  // Add your 1st floor stair/lift nodes here
  // Example:
  // {
  //   id: "nav_stair_1f_1",
  //   x: 0, // TODO: Add coordinate
  //   y: 0, // TODO: Add coordinate
  //   type: "nav_path"
  // },

  {
    id: "nav_stair_1_1",
    x: 1327.15, // TODO: Add coordinate
    y: 704.97, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_stair_2_1",
    x: 689, // TODO: Add coordinate
    y: 837, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_stair_3_1",
    x: 517.1, // TODO: Add coordinate
    y: 380.36, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_stair_4_1",
    x: 1172.45, // TODO: Add coordinate
    y: 203.92, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_lift_CS2_1",
    x: 1264, // TODO: Add coordinate
    y: 212, // TODO: Add coordinate
    type: "nav_lift"
  },

  // ============================================
  // 2ND FLOOR NODES
  // ============================================
  
  // ============================================
  // 2ND FLOOR - NAV_PATH NODES
  // ============================================
  // Add your 2nd floor path nodes here
  // Example:
  // {
  //   id: "nav_path_2f_1",
  //   x: 0, // TODO: Add coordinate
  //   y: 0, // TODO: Add coordinate
  //   type: "nav_path"
  // },

  {
    id: "nav_path_78",
    x: 1192, // TODO: Add coordinate
    y: 187, // TODO: Add coordinate
    type: "nav_path"
  },  
  {
    id: "nav_path_79",
    x: 1216, // TODO: Add coordinate
    y: 232, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_80",
    x: 1237, // TODO: Add coordinate
    y: 296, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_81",
    x: 1269, // TODO: Add coordinate
    y: 290, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_82",
    x: 1286, // TODO: Add coordinate
    y: 453, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_83",
    x: 1343, // TODO: Add coordinate
    y: 621, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_84",
    x: 1361, // TODO: Add coordinate
    y: 672, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_85",
    x: 1442, // TODO: Add coordinate
    y: 669, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_86",
    x: 1497.25, // TODO: Add coordinate
    y: 667.22, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_87",
    x: 1516, // TODO: Add coordinate
    y: 617, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_88",
    x: 1558, // TODO: Add coordinate
    y: 574.72, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_89",
    x: 1606, // TODO: Add coordinate
    y: 559, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_90",
    x: 1666, // TODO: Add coordinate
    y: 564, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_91",
    x: 1712, // TODO: Add coordinate
    y: 591, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_92",
    x: 1743, // TODO: Add coordinate
    y: 635, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_93",
    x: 1753, // TODO: Add coordinate
    y: 689, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_94",
    x: 1745, // TODO: Add coordinate
    y: 722, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_95",
    x: 1310, // TODO: Add coordinate
    y: 632, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_96",
    x: 1322, // TODO: Add coordinate
    y: 683, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_97",
    x: 1267, // TODO: Add coordinate
    y: 642, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_98",
    x: 1182, // TODO: Add coordinate
    y: 658, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_99",
    x: 1148, // TODO: Add coordinate
    y: 665, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_100",
    x: 1065, // TODO: Add coordinate
    y: 678, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_101",
    x: 1013, // TODO: Add coordinate
    y: 679, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_102",
    x: 920, // TODO: Add coordinate
    y: 676, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_103",
    x: 866, // TODO: Add coordinate
    y: 674, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_104",
    x: 836, // TODO: Add coordinate
    y: 669, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_105",
    x: 734, // TODO: Add coordinate
    y: 645, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_106",
    x: 730, // TODO: Add coordinate
    y: 668, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_107",
    x: 638, // TODO: Add coordinate
    y: 558, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_108",
    x: 607, // TODO: Add coordinate
    y: 547, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_109",
    x: 491, // TODO: Add coordinate
    y: 488, // TODO: Add coordinate
    type: "nav_path"
  },  
  {
    id: "nav_path_110",
    x: 660.75, // TODO: Add coordinate
    y: 487.95, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_111",
    x: 611, // TODO: Add coordinate
    y: 467, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_112",
    x: 568, // TODO: Add coordinate
    y: 448, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_113",
    x: 683, // TODO: Add coordinate
    y: 388, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_114",
    x: 921, // TODO: Add coordinate
    y: 257, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_115",
    x: 1037, // TODO: Add coordinate
    y: 195, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_116",
    x: 1080.65, // TODO: Add coordinate
    y: 177.93, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_path_117",
    x: 1144, // TODO: Add coordinate
    y: 172, // TODO: Add coordinate
    type: "nav_path"
  }, 

  // ============================================
  // 2ND FLOOR - NAV_ROOM NODES
  // ============================================
  // Add your 2nd floor room nodes here
  // Example:
  {
    id: "nav_room_postgraduateLab",
    x: 1278, // TODO: Add coordinate
    y: 315, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_softlab1",
    x: 1497, // TODO: Add coordinate
    y: 681, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_softlab2",
    x: 1731, // TODO: Add coordinate
    y: 749, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_userScience",
    x: 920, // TODO: Add coordinate
    y: 717, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_HPC",
    x: 1155, // TODO: Add coordinate
    y: 698, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_IIS",
    x: 1013, // TODO: Add coordinate
    y: 716, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_MK14",
    x: 1175, // TODO: Add coordinate
    y: 622, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_MK15",
    x: 922, // TODO: Add coordinate
    y: 635, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_MK17",
    x: 913, // TODO: Add coordinate
    y: 242, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_MK18",
    x: 676, // TODO: Add coordinate
    y: 371, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_MK19",
    x: 594.45, // TODO: Add coordinate
    y: 580.96, // TODO: Add coordinate
    type: "nav_room"
  },
  {
    id: "nav_room_MK20",
    x: 474.17, // TODO: Add coordinate
    y: 523.06, // TODO: Add coordinate
    type: "nav_room"
  },

  // ============================================
  // 2ND FLOOR - NAV_STAIR NODES
  // ============================================
  // Add your 2nd floor stair/lift nodes here
  // Example:
  // {
  //   id: "nav_stair_2f_1",
  //   x: 0, // TODO: Add coordinate
  //   y: 0, // TODO: Add coordinate
  //   type: "nav_path"
  // },

  {
    id: "nav_stair_1_2",
    x: 1327.15, // TODO: Add coordinate
    y: 704.97, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_stair_2_2",
    x: 689, // TODO: Add coordinate
    y: 837, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_stair_3_2",
    x: 517.1, // TODO: Add coordinate
    y: 380.36, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_stair_4_2",
    x: 1172.45, // TODO: Add coordinate
    y: 203.92, // TODO: Add coordinate
    type: "nav_path"
  },
  {
    id: "nav_lift_CS2_2",
    x: 1264, // TODO: Add coordinate
    y: 212, // TODO: Add coordinate
    type: "nav_lift"
  },
];

export const navigationConnections = [
  // ============================================
  // GROUND FLOOR CONNECTIONS
  // ============================================
  {
    from: "nav_room_DropPoint",
    to: "nav_path_1"
  },
  {
    from: "nav_path_1",
    to: "nav_path_2"
  },
  {
    from: "nav_path_2",
    to: "nav_path_3"
  },
  {
    from: "nav_path_3",
    to: "nav_path_4"
  },
  {
    from: "nav_path_4",
    to: "nav_path_5"
  },
  {
    from: "nav_path_5",
    to: "nav_path_6"
  },
  {
    from: "nav_path_6",
    to: "nav_path_7"
  },
  {
    from: "nav_path_7",
    to: "nav_path_8"
  },
  {
    from: "nav_path_8",
    to: "nav_path_9"
  },
  {
    from: "nav_path_9",
    to: "nav_path_10"
  },
  {
    from: "nav_path_10",
    to: "nav_path_11"
  },
  {
    from: "nav_path_11",
    to: "nav_path_12"
  },
  {
    from: "nav_path_12",
    to: "nav_path_13"
  },
  {
    from: "nav_path_13",
    to: "nav_path_14"
  },
  {
    from: "nav_path_14",
    to: "nav_path_15"
  },
  {
    from: "nav_path_15",
    to: "nav_path_16"
  },
  {
    from: "nav_path_16",
    to: "nav_path_17"
  },
  {
    from: "nav_path_17",
    to: "nav_path_20"
  },
  {
    from: "nav_path_17",
    to: "nav_path_18"
  },
  {
    from: "nav_path_18",
    to: "nav_path_19"
  },
  {
    from: "nav_path_20",
    to: "nav_path_21"
  },
  {
    from: "nav_path_21",
    to: "nav_path_22"
  },
  {
    from: "nav_path_23",
    to: "nav_path_24"
  },
  {
    from: "nav_path_24",
    to: "nav_path_25"
  },
  {
    from: "nav_path_25",
    to: "nav_path_26"
  },
  {
    from: "nav_path_26",
    to: "nav_path_27"
  },
  {
    from: "nav_path_27",
    to: "nav_path_28"
  },
  {
    from: "nav_path_28",
    to: "nav_path_2"
  },
  {
    from: "nav_path_6",
    to: "nav_path_29"
  },
  {
    from: "nav_path_29",
    to: "nav_path_30"
  },
  {
    from: "nav_path_30",
    to: "nav_path_31"
  },
  {
    from: "nav_path_31",
    to: "nav_path_32"
  },
  {
    from: "nav_path_32",
    to: "nav_path_33"
  },
  {
    from: "nav_path_33",
    to: "nav_path_34"
  },
  {
    from: "nav_path_34",
    to: "nav_path_35"
  },
  {
    from: "nav_path_35",
    to: "nav_path_36"
  },
  {
    from: "nav_path_36",
    to: "nav_path_37"
  },
  {
    from: "nav_path_37",
    to: "nav_path_38"
  },
  {
    from: "nav_path_38",
    to: "nav_path_39"
  },
  {
    from: "nav_path_39",
    to: "nav_path_40"
  },
  {
    from: "nav_path_40",
    to: "nav_path_41"
  },
  {
    from: "nav_path_40",
    to: "nav_path_40"
  },
  {
    from: "nav_path_33",
    to: "nav_path_41"
  },

  // PATH TO ROOM
  {
    from: "nav_path_1",
    to: "nav_room_He&She"
  },
  {
    from: "nav_path_2",
    to: "nav_stair_4_G"
  },
  {
    from: "nav_path_3",
    to: "nav_lift_CS2_1"
  },
  {
    from: "nav_path_4",
    to: "nav_room_BK36"
  },
  {
    from: "nav_path_5",
    to: "nav_room_BK37"
  },
  {
    from: "nav_path_7",
    to: "nav_stair_1_G"
  },
  {
    from: "nav_path_9",
    to: "nav_room_IBDAAI"
  },
  {
    from: "nav_path_10",
    to: "nav_room_BilikOmarKhayyam"
  },
  {
    from: "nav_path_11",
    to: "nav_room_SmartClassroom"
  },
  {
    from: "nav_path_12",
    to: "nav_room_PejabatPascaSiswazah"
  },
  {
    from: "nav_path_13",
    to: "nav_room_SOC"
  },
  {
    from: "nav_path_15",
    to: "nav_room_StudentHub"
  },
  {
    from: "nav_path_16",
    to: "nav_stair_2_G"
  },
  {
    from: "nav_path_19",
    to: "nav_room_BackEntrance"
  },
  {
    from: "nav_path_22",
    to: "nav_path_23"
  },
  {
    from: "nav_path_22",
    to: "nav_stair_3_G"
  },
  {
    from: "nav_path_23",
    to: "nav_room_BK33"
  },
  {
    from: "nav_path_24",
    to: "nav_room_BK34"
  },
  {
    from: "nav_path_25",
    to: "nav_room_BK35"
  },
  {
    from: "nav_path_32",
    to: "nav_room_evoCity"
  },
  {
    from: "nav_path_34",
    to: "nav_room_autism"
  },
  {
    from: "nav_path_36",
    to: "nav_room_Cloud"
  },
  {
    from: "nav_path_38",
    to: "nav_room_iDACC"
  },

  // ============================================
  // GROUND FLOOR - REVERSE CONNECTIONS
  // ============================================
  // REVERSE CONNECTIONS - Path to Path (Reverse)
  {
    from: "nav_path_1",
    to: "nav_room_DropPoint"
  },
  {
    from: "nav_path_2",
    to: "nav_path_1"
  },
  {
    from: "nav_path_3",
    to: "nav_path_2"
  },
  {
    from: "nav_path_4",
    to: "nav_path_3"
  },
  {
    from: "nav_path_5",
    to: "nav_path_4"
  },
  {
    from: "nav_path_6",
    to: "nav_path_5"
  },
  {
    from: "nav_path_7",
    to: "nav_path_6"
  },
  {
    from: "nav_path_8",
    to: "nav_path_7"
  },
  {
    from: "nav_path_9",
    to: "nav_path_8"
  },
  {
    from: "nav_path_10",
    to: "nav_path_9"
  },
  {
    from: "nav_path_11",
    to: "nav_path_10"
  },
  {
    from: "nav_path_12",
    to: "nav_path_11"
  },
  {
    from: "nav_path_13",
    to: "nav_path_12"
  },
  {
    from: "nav_path_14",
    to: "nav_path_13"
  },
  {
    from: "nav_path_15",
    to: "nav_path_14"
  },
  {
    from: "nav_path_16",
    to: "nav_path_15"
  },
  {
    from: "nav_path_17",
    to: "nav_path_16"
  },
  {
    from: "nav_path_20",
    to: "nav_path_17"
  },
  {
    from: "nav_path_18",
    to: "nav_path_17"
  },
  {
    from: "nav_path_19",
    to: "nav_path_18"
  },
  {
    from: "nav_path_21",
    to: "nav_path_20"
  },
  {
    from: "nav_path_22",
    to: "nav_path_21"
  },
  {
    from: "nav_path_23",
    to: "nav_path_22"
  },
  {
    from: "nav_path_24",
    to: "nav_path_23"
  },
  {
    from: "nav_path_25",
    to: "nav_path_24"
  },
  {
    from: "nav_path_26",
    to: "nav_path_25"
  },
  {
    from: "nav_path_27",
    to: "nav_path_26"
  },
  {
    from: "nav_path_28",
    to: "nav_path_27"
  },
  {
    from: "nav_path_2",
    to: "nav_path_28"
  },
  {
    from: "nav_path_29",
    to: "nav_path_6"
  },
  {
    from: "nav_path_30",
    to: "nav_path_29"
  },
  {
    from: "nav_path_31",
    to: "nav_path_30"
  },
  {
    from: "nav_path_32",
    to: "nav_path_31"
  },
  {
    from: "nav_path_33",
    to: "nav_path_32"
  },
  {
    from: "nav_path_34",
    to: "nav_path_33"
  },
  {
    from: "nav_path_35",
    to: "nav_path_34"
  },
  {
    from: "nav_path_36",
    to: "nav_path_35"
  },
  {
    from: "nav_path_37",
    to: "nav_path_36"
  },
  {
    from: "nav_path_38",
    to: "nav_path_37"
  },
  {
    from: "nav_path_39",
    to: "nav_path_38"
  },
  {
    from: "nav_path_40",
    to: "nav_path_39"
  },
  {
    from: "nav_path_41",
    to: "nav_path_40"
  },
  {
    from: "nav_path_40",
    to: "nav_path_40"
  },
  {
    from: "nav_path_41",
    to: "nav_path_33"
  },

  // REVERSE CONNECTIONS - Path to Room (Reverse)
  {
    from: "nav_room_He&She",
    to: "nav_path_1"
  },
  {
    from: "nav_stair_4_G",
    to: "nav_path_2"
  },
  {
    from: "nav_lift_CS2_1",
    to: "nav_path_3"
  },
  {
    from: "nav_room_BK36",
    to: "nav_path_4"
  },
  {
    from: "nav_room_BK37",
    to: "nav_path_5"
  },
  {
    from: "nav_stair_1_G",
    to: "nav_path_7"
  },
  {
    from: "nav_room_IBDAAI",
    to: "nav_path_9"
  },
  {
    from: "nav_room_BilikOmarKhayyam",
    to: "nav_path_10"
  },
  {
    from: "nav_room_BilikOmarKhayyam",
    to: "nav_path_11"
  },
  {
    from: "nav_room_PejabatPascaSiswazah",
    to: "nav_path_12"
  },
  {
    from: "nav_room_SOC",
    to: "nav_path_13"
  },
  {
    from: "nav_room_StudentHub",
    to: "nav_path_15"
  },
  {
    from: "nav_stair_2_G",
    to: "nav_path_16"
  },
  {
    from: "nav_room_BackEntrance",
    to: "nav_path_19"
  },
  {
    from: "nav_stair_3_G",
    to: "nav_path_22"
  },
  {
    from: "nav_room_BK33",
    to: "nav_path_23"
  },
  {
    from: "nav_room_BK34",
    to: "nav_path_24"
  },
  {
    from: "nav_room_BK35",
    to: "nav_path_25"
  },
  {
    from: "nav_room_evoCity",
    to: "nav_path_32"
  },
  {
    from: "nav_room_autism",
    to: "nav_path_34"
  },
  {
    from: "nav_room_Cloud",
    to: "nav_path_36"
  },
  {
    from: "nav_room_iDACC",
    to: "nav_path_38"
  },

  // ============================================
  // 1ST FLOOR CONNECTIONS
  // ============================================
  // Add your 1st floor connections here
  // Example:
  // {
  //   from: "nav_path_1f_1",
  //   to: "nav_path_1f_2"
  // },
  // {
  //   from: "nav_path_1f_1",
  //   to: "nav_room_1f_RoomName"
  // },

  // PATH TO PATH

  {
    from: "nav_path_42",
    to: "nav_path_43"
  },
  {
    from: "nav_path_43",
    to: "nav_path_44"
  },
  {
    from: "nav_path_44",
    to: "nav_path_45"
  },
  {
    from: "nav_path_45",
    to: "nav_path_46"
  },
  {
    from: "nav_path_46",
    to: "nav_path_47"
  },
  {
    from: "nav_path_47",
    to: "nav_path_48"
  },
  {
    from: "nav_path_47",
    to: "nav_path_49"
  },
  {
    from: "nav_path_49",
    to: "nav_path_50"
  },
  {
    from: "nav_path_49",
    to: "nav_stair_1_1"
  },
  { 
    from: "nav_path_50",
    to: "nav_path_51"
  },
  {
    from: "nav_path_51",
    to: "nav_path_52"
  },
  {
    from: "nav_path_52",
    to: "nav_path_53"
  },
  {
    from: "nav_path_53",
    to: "nav_path_54"
  },
  {
    from: "nav_path_54",
    to: "nav_path_55"
  },
  {
    from: "nav_path_55",
    to: "nav_path_56"
  },
  {
    from: "nav_path_56",
    to: "nav_path_57"
  },
  {
    from: "nav_path_57",
    to: "nav_path_58"
  },
  {
    from: "nav_path_57",
    to: "nav_path_65"
  },
  { 
    from: "nav_path_58",
    to: "nav_path_59"
  },
  {
    from: "nav_path_59",
    to: "nav_path_60"
  },
  {
    from: "nav_path_60",
    to: "nav_path_61"
  },
  {
    from: "nav_path_61",
    to: "nav_path_62"
  },
  {
    from: "nav_path_62",
    to: "nav_path_63"
  },
  {
    from: "nav_path_63",
    to: "nav_path_64"
  },
  {
    from: "nav_path_65",
    to: "nav_path_66"
  },
  { 
    from: "nav_path_65",
    to: "nav_path_58"
  },
  {
    from: "nav_path_66",
    to: "nav_path_67"
  },
  { 
    from: "nav_path_67",
    to: "nav_path_68"
  },
  {
    from: "nav_path_66",
    to: "nav_path_69"
  },
  { 
    from: "nav_path_69",
    to: "nav_path_70"
  },
  {
    from: "nav_path_70",
    to: "nav_path_71"
  },
  { 
    from: "nav_path_71",
    to: "nav_path_72"
  },
  { 
    from: "nav_path_71",
    to: "nav_stair_3_1"
  },
  {
    from: "nav_path_72",
    to: "nav_path_73"
  },
  {
    from: "nav_path_73",
    to: "nav_path_74"
  },
  {
    from: "nav_path_74",
    to: "nav_path_75"
  },
  {
    from: "nav_path_75",
    to: "nav_path_76"
  },
  {
    from: "nav_path_76",
    to: "nav_path_77"
  },
  {
    from: "nav_path_77",
    to: "nav_path_42"
  },

  // PATH TO ROOM

  { 
    from: "nav_path_42",
    to: "nav_stair_4_1"
  },
  {
    from: "nav_path_43",
    to: "nav_lift_CS2_1"
  },
  {
    from: "nav_path_44",
    to: "nav_room_GLS"
  },
  {
    from: "nav_path_48",
    to: "nav_room_HEP"
  },
  {
    from: "nav_path_51",
    to: "nav_room_BK20"
  },
  {
    from: "nav_path_52",
    to: "nav_room_BK21"
  },
  {
    from: "nav_path_53",
    to: "nav_room_BK22"
  },
  {
    from: "nav_path_54",
    to: "nav_room_BK23"
  },
  {
    from: "nav_path_59",
    to: "nav_room_BK24"
  },
  {
    from: "nav_path_61",
    to: "nav_room_BK25"
  },
  {
    from: "nav_path_63",
    to: "nav_room_BK26"
  },
  {
    from: "nav_path_64",
    to: "nav_room_BK27"
  },
  {
    from: "nav_path_65",
    to: "nav_stair_2_1"
  },
  {
    from: "nav_path_67",
    to: "nav_room_DK2"
  },
  {
    from: "nav_path_68",
    to: "nav_room_DK3"
  },
  {
    from: "nav_path_72",
    to: "nav_room_BK32"
  },
  { 
    from: "nav_path_73",
    to: "nav_room_BK31"
  },
  {
    from: "nav_path_74",
    to: "nav_room_BK30"
  },

  // ============================================
  // 1ST FLOOR - REVERSE CONNECTIONS
  // ============================================
  // REVERSE CONNECTIONS - Path to Path (Reverse)
  {
    from: "nav_path_43",
    to: "nav_path_42"
  },
  {
    from: "nav_path_44",
    to: "nav_path_43"
  },
  {
    from: "nav_path_45",
    to: "nav_path_44"
  },
  {
    from: "nav_path_46",
    to: "nav_path_45"
  },
  {
    from: "nav_path_64",
    to: "nav_path_45"
  },
  {
    from: "nav_path_47",
    to: "nav_path_46"
  },
  {
    from: "nav_path_48",
    to: "nav_path_47"
  },
  {
    from: "nav_path_49",
    to: "nav_path_47"
  },
  {
    from: "nav_path_50",
    to: "nav_path_49"
  },
  {
    from: "nav_stair_1_1",
    to: "nav_path_49"
  },
  {
    from: "nav_path_51",
    to: "nav_path_50"
  },
  {
    from: "nav_path_52",
    to: "nav_path_51"
  },
  {
    from: "nav_path_53",
    to: "nav_path_52"
  },
  {
    from: "nav_path_54",
    to: "nav_path_53"
  },
  {
    from: "nav_path_55",
    to: "nav_path_54"
  },
  {
    from: "nav_path_56",
    to: "nav_path_55"
  },
  {
    from: "nav_path_57",
    to: "nav_path_56"
  },
  {
    from: "nav_path_58",
    to: "nav_path_57"
  },
  {
    from: "nav_path_65",
    to: "nav_path_57"
  },
  {
    from: "nav_path_59",
    to: "nav_path_58"
  },
  {
    from: "nav_path_60",
    to: "nav_path_59"
  },
  {
    from: "nav_path_61",
    to: "nav_path_60"
  },
  {
    from: "nav_path_62",
    to: "nav_path_61"
  },
  {
    from: "nav_path_63",
    to: "nav_path_62"
  },
  {
    from: "nav_path_64",
    to: "nav_path_63"
  },
  {
    from: "nav_path_66",
    to: "nav_path_65"
  },
  {
    from: "nav_path_58",
    to: "nav_path_65"
  },
  {
    from: "nav_path_67",
    to: "nav_path_66"
  },
  {
    from: "nav_path_68",
    to: "nav_path_67"
  },
  {
    from: "nav_path_69",
    to: "nav_path_66"
  },
  {
    from: "nav_path_70",
    to: "nav_path_69"
  },
  {
    from: "nav_path_71",
    to: "nav_path_70"
  },
  {
    from: "nav_path_72",
    to: "nav_path_71"
  },
  {
    from: "nav_stair_3_1",
    to: "nav_path_71"
  },
  {
    from: "nav_path_73",
    to: "nav_path_72"
  },
  {
    from: "nav_path_74",
    to: "nav_path_73"
  },
  {
    from: "nav_path_75",
    to: "nav_path_74"
  },
  {
    from: "nav_path_76",
    to: "nav_path_75"
  },
  {
    from: "nav_path_77",
    to: "nav_path_76"
  },
  {
    from: "nav_path_42",
    to: "nav_path_77"
  },

  // REVERSE CONNECTIONS - Path to Room (Reverse)
  {
    from: "nav_stair_4_1",
    to: "nav_path_42"
  },
  {
    from: "nav_lift_CS2_1",
    to: "nav_path_43"
  },
  {
    from: "nav_room_GLS",
    to: "nav_path_44"
  },
  {
    from: "nav_room_HEP",
    to: "nav_path_48"
  },
  {
    from: "nav_room_BK20",
    to: "nav_path_51"
  },
  {
    from: "nav_room_BK21",
    to: "nav_path_52"
  },
  {
    from: "nav_room_BK22",
    to: "nav_path_53"
  },
  {
    from: "nav_room_BK23",
    to: "nav_path_54"
  },
  {
    from: "nav_room_BK24",
    to: "nav_path_59"
  },
  {
    from: "nav_room_BK25",
    to: "nav_path_61"
  },
  {
    from: "nav_room_BK26",
    to: "nav_path_63"
  },
  {
    from: "nav_room_BK27",
    to: "nav_path_64"
  },
  {
    from: "nav_stair_2_1",
    to: "nav_path_65"
  },
  {
    from: "nav_room_DK2",
    to: "nav_path_67"
  },
  {
    from: "nav_room_DK3",
    to: "nav_path_68"
  },
  {
    from: "nav_room_BK32",
    to: "nav_path_72"
  },
  {
    from: "nav_room_BK31",
    to: "nav_path_73"
  },
  {
    from: "nav_room_BK30",
    to: "nav_path_74"
  },

  // ============================================
  // 2ND FLOOR CONNECTIONS
  // ============================================
  // Add your 2nd floor connections here
  // Example:
  // {
  //   from: "nav_path_2f_1",
  //   to: "nav_path_2f_2"
  // },
  // {
  //   from: "nav_path_2f_1",
  //   to: "nav_room_2f_RoomName"
  // },

  // PATH TO PATH

  {
    from: "nav_path_78",
    to: "nav_path_79"
  },
  {
    from: "nav_path_79",
    to: "nav_path_80"
  },
  {
    from: "nav_path_80",
    to: "nav_path_81"
  },
  {
    from: "nav_path_80",
    to: "nav_path_82"
  },
  {
    from: "nav_path_82",
    to: "nav_path_83"
  },
  {
    from: "nav_path_83",
    to: "nav_path_84"
  },
  {
    from: "nav_path_83",
    to: "nav_path_95"
  },
  {
    from: "nav_path_84",
    to: "nav_path_85"
  },
  {
    from: "nav_path_84",
    to: "nav_path_96"
  },
  {
    from: "nav_path_85",
    to: "nav_path_86"
  },
  {
    from: "nav_path_86",
    to: "nav_path_87"
  },
  {
    from: "nav_path_87",
    to: "nav_path_88"
  },
  {
    from: "nav_path_88",
    to: "nav_path_89"
  },
  {
    from: "nav_path_89",
    to: "nav_path_90"
  },
  {
    from: "nav_path_90",
    to: "nav_path_91"
  },
  {
    from: "nav_path_91",
    to: "nav_path_92"
  },
  {
    from: "nav_path_92",
    to: "nav_path_93"
  },
  {
    from: "nav_path_93",
    to: "nav_path_94"
  },
  {
    from: "nav_path_95",
    to: "nav_path_97"
  },
  {
    from: "nav_path_97",
    to: "nav_path_98"
  },
  {
    from: "nav_path_98",
    to: "nav_path_99"
  },
  {
    from: "nav_path_99",
    to: "nav_path_100"
  },
  {
    from: "nav_path_100",
    to: "nav_path_101"
  },
  { 
    from: "nav_path_101",
    to: "nav_path_102"
  },
  {
    from: "nav_path_102",
    to: "nav_path_103"
  },
  {
    from: "nav_path_103",
    to: "nav_path_104"
  },
  {
    from: "nav_path_104",
    to: "nav_path_105"
  },
  {
    from: "nav_path_105",
    to: "nav_path_106"
  },
  {
    from: "nav_path_105",
    to: "nav_path_107"
  },
  { 
    from: "nav_path_107",
    to: "nav_path_108"
  },
  {
    from: "nav_path_107",
    to: "nav_path_110"
  },
  {
    from: "nav_path_108",
    to: "nav_path_109"
  },
  {
    from: "nav_path_110",
    to: "nav_path_111"
  },
  {
    from: "nav_path_111",
    to: "nav_path_112"
  },
  {
    from: "nav_path_112",
    to: "nav_path_113"
  },
  {
    from: "nav_path_113",
    to: "nav_path_114"
  },
  {
    from: "nav_path_114",
    to: "nav_path_115"
  },
  {
    from: "nav_path_115",
    to: "nav_path_116"
  },
  {
    from: "nav_path_116",
    to: "nav_path_117"
  },
  {
    from: "nav_path_117",
    to: "nav_path_78"
  },

  // PATH TO ROOM

  {
    from: "nav_path_78",
    to: "nav_stair_4_2"
  },
  {
    from: "nav_path_79",
    to: "nav_lift_CS2_2"
  },
  {
    from: "nav_path_81",
    to: "nav_room_postgraduateLab"
  },
  {
    from: "nav_path_86",
    to: "nav_room_softlab1"
  },
  {
    from: "nav_path_94",
    to: "nav_room_softlab2"
  },
  {
    from: "nav_path_96",
    to: "nav_stair_1_2"
  },
  { 
    from: "nav_path_98",
    to: "nav_room_MK14"
  },
  {
    from: "nav_path_99",
    to: "nav_room_HPC"
  },
  {
    from: "nav_path_101",
    to: "nav_room_IIS"
  },
  {
    from: "nav_path_102",
    to: "nav_room_MK15"
  },
  {
    from: "nav_path_102",
    to: "nav_room_userScience"
  },
  { 
    from: "nav_path_106",
    to: "nav_stair_2_2"
  },
  {
    from: "nav_path_108",
    to: "nav_room_MK19"
  },
  {
    from: "nav_path_109",
    to: "nav_room_MK20"
  },
  {
    from: "nav_path_112",
    to: "nav_stair_3_2"
  },
  {
    from: "nav_path_113",
    to: "nav_room_MK18"
  },
  {
    from: "nav_path_114",
    to: "nav_room_MK17"
  },

  // ============================================
  // 2ND FLOOR - REVERSE CONNECTIONS
  // ============================================
  // REVERSE CONNECTIONS - Path to Path (Reverse)
  {
    from: "nav_path_79",
    to: "nav_path_78"
  },
  {
    from: "nav_path_80",
    to: "nav_path_79"
  },
  {
    from: "nav_path_81",
    to: "nav_path_80"
  },
  {
    from: "nav_path_82",
    to: "nav_path_80"
  },
  {
    from: "nav_path_83",
    to: "nav_path_82"
  },
  {
    from: "nav_path_84",
    to: "nav_path_83"
  },
  {
    from: "nav_path_95",
    to: "nav_path_83"
  },
  {
    from: "nav_path_85",
    to: "nav_path_84"
  },
  {
    from: "nav_path_96",
    to: "nav_path_84"
  },
  {
    from: "nav_path_86",
    to: "nav_path_85"
  },
  {
    from: "nav_path_87",
    to: "nav_path_86"
  },
  {
    from: "nav_path_88",
    to: "nav_path_87"
  },
  {
    from: "nav_path_89",
    to: "nav_path_88"
  },
  {
    from: "nav_path_90",
    to: "nav_path_89"
  },
  {
    from: "nav_path_91",
    to: "nav_path_90"
  },
  {
    from: "nav_path_92",
    to: "nav_path_91"
  },
  {
    from: "nav_path_93",
    to: "nav_path_92"
  },
  {
    from: "nav_path_94",
    to: "nav_path_93"
  },
  {
    from: "nav_path_97",
    to: "nav_path_95"
  },
  {
    from: "nav_path_98",
    to: "nav_path_97"
  },
  {
    from: "nav_path_99",
    to: "nav_path_98"
  },
  {
    from: "nav_path_100",
    to: "nav_path_99"
  },
  {
    from: "nav_path_101",
    to: "nav_path_100"
  },
  {
    from: "nav_path_102",
    to: "nav_path_101"
  },
  {
    from: "nav_path_103",
    to: "nav_path_102"
  },
  {
    from: "nav_path_104",
    to: "nav_path_103"
  },
  {
    from: "nav_path_105",
    to: "nav_path_104"
  },
  {
    from: "nav_path_106",
    to: "nav_path_105"
  },
  {
    from: "nav_path_107",
    to: "nav_path_105"
  },
  {
    from: "nav_path_108",
    to: "nav_path_107"
  },
  {
    from: "nav_path_110",
    to: "nav_path_107"
  },
  {
    from: "nav_path_109",
    to: "nav_path_108"
  },
  {
    from: "nav_path_111",
    to: "nav_path_110"
  },
  {
    from: "nav_path_112",
    to: "nav_path_111"
  },
  {
    from: "nav_path_113",
    to: "nav_path_112"
  },
  {
    from: "nav_path_114",
    to: "nav_path_113"
  },
  {
    from: "nav_path_115",
    to: "nav_path_114"
  },
  {
    from: "nav_path_116",
    to: "nav_path_115"
  },
  {
    from: "nav_path_117",
    to: "nav_path_116"
  },
  {
    from: "nav_path_78",
    to: "nav_path_117"
  },

  // REVERSE CONNECTIONS - Path to Room (Reverse)
  {
    from: "nav_stair_4_2",
    to: "nav_path_78"
  },
  {
    from: "nav_lift_CS2_2",
    to: "nav_path_79"
  },
  {
    from: "nav_room_postgraduateLab",
    to: "nav_path_81"
  },
  {
    from: "nav_room_softlab1",
    to: "nav_path_86"
  },
  {
    from: "nav_room_softlab2",
    to: "nav_path_94"
  },
  {
    from: "nav_stair_1_2",
    to: "nav_path_96"
  },
  {
    from: "nav_room_MK14",
    to: "nav_path_98"
  },
  {
    from: "nav_room_HPC",
    to: "nav_path_99"
  },
  {
    from: "nav_room_IIS",
    to: "nav_path_101"
  },
  {
    from: "nav_room_MK15",
    to: "nav_path_102"
  },
  {
    from: "nav_room_userScience",
    to: "nav_path_102"
  },
  {
    from: "nav_stair_2_2",
    to: "nav_path_106"
  },
  {
    from: "nav_room_MK19",
    to: "nav_path_108"
  },
  {
    from: "nav_room_MK20",
    to: "nav_path_109"
  },
  {
    from: "nav_stair_3_2",
    to: "nav_path_112"
  },
  {
    from: "nav_room_MK18",
    to: "nav_path_113"
  },
  {
    from: "nav_room_MK17",
    to: "nav_path_114"
  },

  // ============================================
  // INTER-FLOOR CONNECTIONS (Stairs/Lifts)
  // ============================================
  // Add connections between floors via stairs/lifts here
  // Example:
  // {
  //   from: "nav_stair_1", // Ground floor stair
  //   to: "nav_stair_1f_1" // 1st floor stair
  // },

  {
    from: "nav_stair_1_G",
    to: "nav_stair_1_1"
  },
  {
    from: "nav_stair_2_G",
    to: "nav_stair_2_1"
  },
  {
    from: "nav_stair_3_G",
    to: "nav_stair_3_1"
  },
  {
    from: "nav_stair_4_G",
    to: "nav_stair_4_1"
  },
  {
    from: "nav_lift_CS2_G",
    to: "nav_lift_CS2_1"
  },
  {
    from: "nav_stair_1_1",
    to: "nav_stair_1_2"
  },
  {
    from: "nav_stair_2_1",
    to: "nav_stair_2_2"
  },
  {
    from: "nav_stair_3_1",
    to: "nav_stair_3_2"
  },
  {
    from: "nav_stair_4_1",
    to: "nav_stair_4_2"
  },
  {
    from: "nav_lift_CS2_1",
    to: "nav_lift_CS2_2"
  },

  // ============================================
  // INTER-FLOOR - REVERSE CONNECTIONS
  // ============================================
  {
    from: "nav_stair_1_1",
    to: "nav_stair_1_G"
  },
  {
    from: "nav_stair_2_1",
    to: "nav_stair_2_G"
  },
  {
    from: "nav_stair_3_1",
    to: "nav_stair_3_G"
  },
  {
    from: "nav_stair_4_1",
    to: "nav_stair_4_G"
  },
  {
    from: "nav_lift_CS2_1",
    to: "nav_lift_CS2_G"
  },
  {
    from: "nav_stair_1_2",
    to: "nav_stair_1_1"
  },
  {
    from: "nav_stair_2_2",
    to: "nav_stair_2_1"
  },
  {
    from: "nav_stair_3_2",
    to: "nav_stair_3_1"
  },
  {
    from: "nav_stair_4_2",
    to: "nav_stair_4_1"
  },
  {
    from: "nav_lift_CS2_2",
    to: "nav_lift_CS2_1"
  },
];

/**
 * Helper function to build graph structure from manual definitions
 * Returns: { nodes: { id: { x, y, edges: [...] } }, ... }
 */
// Helper: Get floor from node ID (for nodes with floor suffixes)
function getFloorFromNodeId(nodeId) {
  if (!nodeId) return null;
  
  // Check for floor suffix: _G, _1, or _2 at the end
  if (nodeId.endsWith('_G')) return 'G';
  if (nodeId.endsWith('_2')) return '2';
  if (nodeId.endsWith('_1')) {
    // Make sure it's not something like _1_G or _1_2
    // Since we checked _G and _2 first, if it ends with _1, it's floor 1
    return '1';
  }
  
  return null;
}

export function buildManualGraph() {
  const graph = {};
  
  // Initialize nodes
  navigationNodes.forEach(node => {
    graph[node.id] = {
      x: node.x,
      y: node.y,
      type: node.type,
      edges: [],
      floor: getFloorFromNodeId(node.id) // Try to get floor from ID suffix
    };
  });
  
  // Add connections as edges
  navigationConnections.forEach(conn => {
    const fromNode = graph[conn.from];
    const toNode = graph[conn.to];
    
    if (!fromNode || !toNode) {
      console.warn(`Invalid connection: ${conn.from} -> ${conn.to}`);
      return;
    }
    
    // Check for duplicate edges before adding
    if (fromNode.edges.find(e => e.to === conn.to)) {
      console.warn(`Duplicate edge skipped: ${conn.from} -> ${conn.to}`);
      return;
    }
    
    // Calculate distance
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const distance = Math.hypot(dx, dy) || 1;
    
    // Add bidirectional edge
    fromNode.edges.push({ to: conn.to, w: distance });
    toNode.edges.push({ to: conn.from, w: distance });
  });
  
  // Find the index where 1st floor nodes start (nodes defined under "1ST FLOOR NODES" section)
  // Ground floor nodes are defined before this index and should be explicitly set to floor 'G'
  let firstFloorStartIndex = navigationNodes.findIndex(node => {
    // nav_path_42 is the first node in the 1st floor section based on the structure
    return node.id === 'nav_path_42';
  });
  
  // If we can't find the exact start, look for other indicators of 1st floor
  if (firstFloorStartIndex === -1) {
    firstFloorStartIndex = navigationNodes.findIndex(node => node.id && node.id.includes('_1') && !node.id.includes('_G') && !node.id.includes('_2'));
  }
  
  // Explicitly assign floor 'G' to all ground floor nodes (those before firstFloorStartIndex)
  // CRITICAL: Override any floor assignments from ID suffixes (e.g., nav_path_1 ending in _1 should be G, not 1)
  const groundFloorNodeIds = new Set();
  if (firstFloorStartIndex > 0) {
    for (let i = 0; i < firstFloorStartIndex; i++) {
      const nodeId = navigationNodes[i].id;
      if (graph[nodeId]) {
        // This is a ground floor node - explicitly assign 'G' even if ID suggests otherwise
        // (e.g., nav_path_1 ends with _1 but is on ground floor, not floor 1)
        const hadFloor = graph[nodeId].floor !== null;
        graph[nodeId].floor = 'G';
        groundFloorNodeIds.add(nodeId);
        if (hadFloor && !nodeId.endsWith('_G')) {
          // Debug: Log overridden floor assignments
          console.debug(`Overrode floor assignment for ${nodeId} (was ${graph[nodeId].floor}, set to 'G')`);
        }
      }
    }
  }
  
  // Debug: Log ground floor assignments
  console.log(`Assigned floor 'G' to ${groundFloorNodeIds.size} ground floor nodes (before index ${firstFloorStartIndex})`);
  
  // Infer floors for nodes without floor suffixes by propagating from nodes with known floors
  // This is done through BFS from known floor nodes (stairs/lifts/rooms with floor info)
  // Priority: Floor 'G' nodes first, then '1', then '2' to avoid incorrect assignments
  const knownFloorNodes = Object.keys(graph).filter(id => graph[id].floor !== null);
  const floorPriority = { 'G': 0, '1': 1, '2': 2 };
  
  // Sort known floor nodes by priority (G first, then 1, then 2)
  const sortedKnownFloorNodes = knownFloorNodes.sort((a, b) => {
    const aFloor = graph[a].floor;
    const bFloor = graph[b].floor;
    return (floorPriority[aFloor] ?? 99) - (floorPriority[bFloor] ?? 99);
  });
  
  const visited = new Set();
  const queue = [...sortedKnownFloorNodes.map(id => ({ id, floor: graph[id].floor }))];
  
  // BFS to propagate floor information
  while (queue.length > 0) {
    const { id, floor } = queue.shift();
    
    if (visited.has(id)) continue;
    visited.add(id);
    
    // If this node doesn't have a floor yet, assign it
    // Priority: Don't overwrite existing floors (once assigned, keep it)
    if (graph[id].floor === null) {
      graph[id].floor = floor;
    }
    
    // Propagate to neighbors (only through non-stair/lift connections for nav_path nodes)
    const node = graph[id];
    for (const edge of node.edges || []) {
      const neighborId = edge.to;
      if (!visited.has(neighborId) && graph[neighborId]) {
        const neighborFloor = graph[neighborId].floor;
        const isStairLift = id.startsWith('nav_stair_') || id.startsWith('nav_lift_');
        const neighborIsStairLift = neighborId.startsWith('nav_stair_') || neighborId.startsWith('nav_lift_');
        
        // Don't propagate floor across stair/lift nodes (they connect different floors)
        if (isStairLift && neighborIsStairLift) {
          // This is an inter-floor connection, skip propagation
          continue;
        }
        
        // CRITICAL: Never overwrite explicitly assigned ground floor nodes
        // These nodes were marked as ground floor before BFS and should remain 'G'
        if (groundFloorNodeIds.has(neighborId)) {
          // This is a ground floor node - skip propagation to prevent overwriting
          continue;
        }
        
        // If neighbor doesn't have a floor, propagate current floor
        // Only propagate if neighbor is still null (don't overwrite)
        if (neighborFloor === null) {
          queue.push({ id: neighborId, floor });
        }
      }
    }
  }
  
  // Debug: Log floor assignments for 2nd floor nodes
  const secondFloorNodes = Object.keys(graph).filter(id => graph[id].floor === '2');
  const secondFloorPaths = Object.keys(graph).filter(id => id.startsWith('nav_path_') && graph[id].floor === '2');
  const secondFloorRooms = Object.keys(graph).filter(id => id.startsWith('nav_room_') && graph[id].floor === '2');
  
  console.log(`Built manual graph with ${navigationNodes.length} nodes and ${navigationConnections.length} connections`);
  console.log(`2nd floor nodes: ${secondFloorNodes.length} total (${secondFloorPaths.length} paths, ${secondFloorRooms.length} rooms)`);
  
  if (secondFloorPaths.length === 0) {
    console.warn('⚠️ No 2nd floor path nodes found! BFS propagation may have failed.');
    console.log('Known 2nd floor nodes (stairs):', Object.keys(graph).filter(id => id.endsWith('_2')));
  }
  
  return graph;
}


