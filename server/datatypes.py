

class MsgType:
	# c->s
	csNewPlayer = 1001
	csJoin = 1002
	csMove = 1003
	csPing = 1004
	csEatEnegyBall = 1005
	csShoot = 1006
	csHitPlayer = 1007
	# s->c
	scError = 2000
	scNewPlayer = 2001
	scJoined = 2002
	scWorldInfo = 2003
	scDeletePlayer = 2004
	scMove = 2005
	scPlayerInfo = 2006
	scPing = 2007
	scEnegyInfo = 2008
	scEatEnegyBall = 2009
	scEnegyChange = 2010
	scShoot = 2011
	scBulletInfo = 2012
	scHitPlayer = 2013

