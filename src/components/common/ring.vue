<template>
  <div class="container">
    <div class="grain"></div>
    <div class="intro">
      <div class="center">
        <!-- <div class="core"></div> -->
        <!-- <div class="outer_one">
          <div v-for="i in 36" :key="`outer_one_${i}`" class="outer_one__piece"></div>
        </div> -->
        <div class="outer_two">
          <div v-for="i in 36" :key="`outer_two_${i}`" class="outer_two__piece"></div>
        </div>
        <div class="outer_three">
          <div v-for="i in 36" :key="`outer_three_${i}`" class="outer_three__piece"></div>
        </div>
        <div class="outer_four">
          <div v-for="i in 36" :key="`outer_four_${i}`" class="outer_four__piece"></div>
        </div>
        <div class="outer_five">
          <div v-for="i in 36" :key="`outer_five_${i}`" class="outer_five__piece"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No reactive data needed for this component
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  animation: intro_box 1s 1s forwards;
  opacity: 0;
  perspective-origin: 50% -10%;
  margin: 0;
  padding: 0;
  font-family: montserrat;
  perspective: 800;
  overflow: hidden;

  .grain {
    transform: scale(1) !important;
    left: 0;
    right: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 100;
    pointer-events: none;
    top: 0;
    opacity: 1;
    bottom: 0;
  }

  .center {
    left: 0;
    right: 0;
    top: 50%;
    position: absolute;
    margin: auto;
    height: 50px;
    width: 50px;
    transform: translateY(-70%) rotateX(110deg) scale(0.3);

    .outer_one,
    .outer_two,
    .outer_three,
    .outer_four,
    .outer_five,
    .pieces {
      position: absolute;
      width: 50px;
      height: 50px;
      left: 50%;
    }

    .core {
      width: 50px;
      height: 50px;
      border-radius: 50px;
      background: #00ccff;
      box-shadow: 0px 0px 70px 20px #00ccff;
    }

    .outer_one {
      transform: translateX(-120px) translateY(-50%);

      &__piece {
        position: absolute;
        width: 10px;
        height: 30px;
        background: #00ccff;
        box-shadow: 0px 0px 20px 0px #00ccff;
        transform-origin: 120px 0px;
        border-radius: 2px;

        @for $i from 1 through 36 {
          &:nth-of-type(#{$i}) {
            transform: rotateZ($i * 10deg);
          }
        }
      }
    }

    .outer_two {
      transform: translateX(-290px) translateY(-50%);

      &__piece {
        position: absolute;
        width: 28px;
        height: 5px;
        background: #00ccff;
        box-shadow: 0px 0px 20px 0px #00ccff;
        transform-origin: 290px 0px;
        border-radius: 2px;

        @for $i from 1 through 36 {
          &:nth-of-type(#{$i}) {
            transform: rotateZ($i * 10deg);
            animation: fade 5s ($i * 0.1s) infinite;
          }
        }
      }
    }

    .outer_three {
      transform: translateX(-440px) translateY(-50%);

      &__piece {
        position: absolute;
        width: 55px;
        height: 5px;
        background: #55E2F9;
        box-shadow: 0px 0px 20px 0px #55E2F9;
        transform-origin: 440px 0px;
        border-radius: 2px;

        @for $i from 1 through 36 {
          &:nth-of-type(#{$i}) {
            transform: rotateZ($i * 4deg);
            animation: fade 5s ($i * 0.1s) infinite;
          }
        }
      }
    }

    .outer_four {
      transform: translateX(-440px) translateY(-50%);

      &__piece {
        position: absolute;
        width: 6px;
        height: 5px;
        background: #00ccff;
        box-shadow: 0px 0px 20px 0px #00ccff;
        transform-origin: 440px 0px;
        border-radius: 2px;

        @for $i from 1 through 36 {
          &:nth-of-type(#{$i}) {
            transform: rotateZ(-176deg + ($i * 4deg));
            animation: fade 7s ($i * 0.1s) infinite;
          }
        }
      }
    }

    .outer_five {
      transform: translateX(-410px) translateY(-50%);

      &__piece {
        position: absolute;
        width: 6px;
        height: 5px;
        background: #00ccff;
        box-shadow: 0px 0px 20px 0px #00ccff;
        transform-origin: 410px 0px;
        border-radius: 2px;

        @for $i from 1 through 36 {
          &:nth-of-type(#{$i}) {
            transform: rotateZ(-176deg + ($i * 4deg));
            animation: fade 7s ($i * 0.1s) infinite;
          }
        }
      }
    }
  }
}

/* animations */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes fade {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  25% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  75% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes inalt {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes wiggle {
  0% {
    transform: translateY(0) translateZ(-840px) rotateX(64deg) rotateY(-21deg) rotatez(80deg) scale(0.9);
  }

  25% {
    transform: translateY(0) translateZ(-820px) rotateX(66deg) rotateY(-24deg) rotatez(84deg) scale(0.9);
  }

  50% {
    transform: translateY(0) translateZ(-840px) rotateX(62deg) rotateY(-23deg) rotatez(82deg) scale(0.9);
  }

  75% {
    transform: translateY(0) translateZ(-840px) rotateX(63deg) rotateY(-19deg) rotatez(78deg) scale(0.9);
  }

  100% {
    transform: translateY(0) translateZ(-840px) rotateX(64deg) rotateY(-21deg) rotatez(80deg) scale(0.9);
  }
}

@keyframes wiggle2 {
  0% {
    transform: translateY(0) translateZ(-840px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(0.9);
  }

  25% {
    transform: translateY(0) translateZ(-820px) rotateX(0deg) rotateY(0deg) rotateZ(4deg) scale(0.9);
  }

  50% {
    transform: translateY(0) translateZ(-840px) rotateX(0deg) rotateY(0deg) rotateZ(-2deg) scale(0.9);
  }

  75% {
    transform: translateY(0) translateZ(-840px) rotateX(0deg) rotateY(0deg) rotateZ(2deg) scale(0.9);
  }

  100% {
    transform: translateY(0) translateZ(-840px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(0.9);
  }
}

@keyframes no-wiggle {
  to {
    transform: translateY(0) translateZ(-840px) rotateX(145deg) rotateY(0deg) rotateZ(0deg) scale(0.9);
  }
}

@keyframes intro_box {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  20% {
    opacity: 1;
    transform: scale(1.2);
  }

  40% {
    transform: scale(0.89);
  }

  60% {
    transform: scale(1.04);
  }

  80% {
    transform: scale(0.98);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>