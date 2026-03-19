extends CharacterBody2D

# 玩家控制脚本

const SPEED = 300.0

func _physics_process(delta):
	# 获取输入方向
	var direction = Input.get_axis("move_left", "move_right")
	
	# 移动
	velocity.x = direction * SPEED
	
	# 应用移动
	move_and_slide()
