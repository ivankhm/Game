function randInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

class Character {
  constructor(name, minAttack, maxAttack, minHeal, maxHeal, maxHealth) {
    this.name = name
    this.maxAttack = maxAttack

    this.minAttack = minAttack
    this.maxHealth = maxHealth

    this.minHeal = minHeal
    this.maxHeal = maxHeal

    this.lastActionLog = ''

    this.currentHealth = maxHealth
  }
  attack(enemy) {
    var attackerPower = Character.getAttackPower(this)
    var enemyPower = Math.floor(Character.getAttackPower(enemy)*0.5)

    this.trade(enemy, enemyPower, attackerPower)
    this.lastActionLog = `${this.name} attacks ${enemy.name} for ${attackerPower} dmg, getting ${enemyPower} in return!`
  }
  heal() {
    var healPower = randInterval(this.minHeal, this.maxHeal)
    this.currentHealth += healPower

    this.lastActionLog = `${this.name} is healing for ${healPower} hp!`
    this.checkHealth()
  }
  specialAttack(enemy) {
    var attackerPower = Character.getAttackPower(this) * 2
    var enemyPower = enemy.maxAttack

    this.trade(enemy, enemyPower, attackerPower)
    this.lastActionLog = `${this.name} charges a spetial attack into ${enemy.name}'s fase for ${attackerPower} dmg, getting ${enemyPower} in return!`
  }

  static getAttackPower(character) {
    return randInterval(character.minAttack, character.maxAttack)
  }
  trade(enemy, enemyPower, attackerPower) {
    this.currentHealth -= enemyPower
    enemy.currentHealth -= attackerPower
  }

  healthString() {
    return `${this.currentHealth} / ${this.maxHealth}`
  }

  healthPC() {
    return Math.floor((this.currentHealth / this.maxHealth) * 100)
  }

  checkHealth() {
    if (this.currentHealth > this.maxHealth) {
      this.currentHealth = this.maxHealth
    }
  }

  reset() {
    this.currentHealth = this.maxHealth
  }
}

var app = new Vue({
  el: '#app',
  data: {
    player: new Character('IVAN', 15, 30, 40, 60, 100),
    monster: new Character('MONSTER', 20, 40, 20, 30, 120),
    currentCharacter: this.player,
    isFighting: false,
    logs: []
  },
  methods: {
    reset() {
      this.player.reset();
      this.monster.reset();
      this.logs = []
    },
    startNewGame() {
      this.reset()
      this.isFighting = true
    },
    goToMenu() {
      this.reset()
      this.isFighting = false
    },
    attackMonster() {
      this.player.attack(this.monster)
      this.monsterTurn()
    },
    spetialAttackMonster() {
      this.player.specialAttack(this.monster)
      this.monsterTurn()
    },
    heal() {
      this.player.heal()
      this.monsterTurn()
    },
    monsterTurn() {
      console.log('inside monsterTurn')
      var action = randInterval(1, 100)
      //kill player if he can
      if (this.player.currentHealth <= this.monster.minAttack) {
        action = 1;
      }
      if (this.player.currentHealth <= (this.monster.minAttack*2)) {
        action = 65;
      }

      //heal yourself
      if (this.monster.currentHealth < 50) {
        action = 100
      }
      //when full hp always spetial attack
      if (this.monster.currentHealth == this.monster.maxHealth) {
        action = 65
      }
      console.log('action: ' + action)
      switch (true) {
        case (action < 60):
          this.monster.attack(this.player)
          console.log('worked: ' + action)
          break;
        case ((action >= 60) && (action < 70)):
          this.monster.specialAttack(this.player)
          console.log('player heath'+this.player.currentHealth);
          console.log('monster heath'+this.monster.currentHealth);
          console.log('worked: ' + action)
          break;
        case (action >=70):
          this.monster.heal(this.player)
          console.log('worked: ' + action)
          break;
        default:
          break;
      }
    }
  },
  watch: {
    playerLastAction(value) {
      this.logs.push({
        message: value,
        turnStyle: 'player-turn'
      })
    },
    monsterLastAction(value) {
      this.logs.push({
        message: value,
        turnStyle: 'monster-turn'
      })
    },
    playerHealthPC(value) {
      console.log('player health:' + value);
      if (value <= 0) {
        alert('YOU LOSE!')
        this.isFighting = false
      }
    },
    monsterHealthPC(value) {
      if (value <= 0) {
        alert('YOU WIN!')
        this.isFighting = false
      }
    }

  },
  computed: {
    playerLastAction() {
      return this.player.lastActionLog;
    },
    monsterLastAction() {
      return this.monster.lastActionLog;
    },
    playerHealth() {
      return this.player.healthString();
    },
    monsterHealth() {
      return this.monster.healthString();
    },
    playerHealthPC() {
      return this.player.healthPC()
    },
    monsterHealthPC() {
      return this.monster.healthPC()
    }
  }
})
