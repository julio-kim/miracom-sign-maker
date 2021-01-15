<template>
    <div class="ui padded segment template" :class="segmentStyle" :refid="refid">
        <div class="ui grid">
            <div class="row">
                <div class="column">
                    <div class="ui small image">
                        <img :src="logoSrc" />
                    </div>
                </div>
            </div>
            <div class="four wide column"><h3 class="ui header" :class="headerStyle">{{ name }}</h3></div>
            <div class="twelve wide column">{{ department }}</div>
            <div class="four wide column">
                <div class="ui image">
                    <img :src="qrSrc" />
                </div>
            </div>
            <div class="twelve wide column middle alignedd">
                <i class="small home icon"></i> {{ homepage }}<br/>
                <i class="small phone icon"></i> {{ phone }}<br/>
                <i class="small envelope outline icon"></i> {{ email }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        refid: {
            type: String,
            required: true
        },
        name: {
            type: String,
            default: '홍 길 동'
        },
        department: {
            type: String,
            default: '클라우드운영그룹'
        },
        homepage: {
            type: String,
            default: 'www.miracom.co.kr'
        },
        phone: {
            type: String,
            default: '02-1234-5678'
        },
        email: {
            type: String,
            default: 'gd.hong@miracom.co.kr'
        },
        inverted: {
            type: Boolean,
            default: false
        },
        colored: {
            validator (value) {
                return [
                    'grey', 'black', 'blue', 'teal',
                    'violet', 'purple', 'pink', 'brown',
                    'red', 'orange', 'yellow', 'olive', 'green'
                ].indexOf(value) !== -1
            }
        },
        colorVariation: {
            validator (value) {
                return ['secondary', 'tertiary'].indexOf(value) !== -1
            }
        },
        logoVariation: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        segmentStyle () {
            let styles = []
            if (this.colorVariation) styles.push(this.colorVariation)
            if (this.colored) styles.push(this.colored)
            if (this.inverted) styles.push('inverted')
            return styles.join(' ')
        },
        headerStyle () {
            return (this.inverted) ? 'inverted' : ''
        },
        logoSrc () {
            if (this.logoVariation) return './assets/logos/miracom_logo_black.png'
            else {
                if (this.inverted) return './assets/logos/miracom_logo_white.png'
                else return './assets/logos/miracom_logo_blue.png'
            }
        },
        qrSrc () {
            return (this.inverted) ? './assets/logos/miracom_qr_white.png' :
                './assets/logos/miracom_qr_black.png'
        }
    }
}
</script>

<style scoped>
.template.segment {
    box-shadow: none !important;
    border-radius: 1.285714rem !important;
}
</style>