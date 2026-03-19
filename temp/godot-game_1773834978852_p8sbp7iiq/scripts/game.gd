extends Node2D

# game_1773834978852_p - Godot 4.x 版本
# 由 AI Game Platform 自动生成

var score = 0
var game_over = false

func _ready():
	print("game_1773834978852_p 已启动")
	print("HTML5 版本已转换为 Godot 版本")
	
func _process(delta):
	if game_over:
		return
	
	# 游戏逻辑在这里实现
	# TODO: 从 HTML5 代码转换游戏逻辑
	
func start_game():
	game_over = false
	score = 0
	print("游戏开始")
	
func end_game():
	game_over = true
	print("游戏结束！得分：", score)
