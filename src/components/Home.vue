<template>
    <div>
        <div class="ui inverted vertical masthead center aligned segment">
            <div class="ui text container">
                <h1 class="ui inverted header">SignMaker</h1>
            </div>
        </div>

        <div class="ui notice container">
            <div class="ui icon info message">
                <i class="user secret icon"></i>
                <div class="content">
                    <div class="header">
                        보안 걱정없이 안심하고 사용하세요~:)
                    </div>
                    <ul class="list">
                        <li>HTML 생성시 서버 사이드로 데이터를 전송하지 않습니다</li>
                        <li>Image DataURL도 프론트엔드에서 생성하여 전달합니다</li>
                    </ul>
                </div>
            </div>
            <div v-if="isIE" class="ui negative message">
                <div class="header">가급적 Internet Explorer는 사용을 자제해 주세요</div>
                <ul class="list">
                    <li>브라우저 호환성을 유지하기 위해 최대한 노력하고 있지만, 아직도 일부 기능은 IE에서 정상적으로 동작하지 않고 있습니다</li>
                    <li>성능도 상당히 좋지 않아요~~:(</li>
                    <li>가급적 Chrome이나 Edge 등의 브라우저 사용을 권장드립니다</li>
                </ul>
            </div>
        </div>

        <mail-sign-renderer />

        <div class="ui vertical footer segment">
            <div class="ui center aligned container">
                <div class="ui section divider"></div>
                <div class="ui horizontal small divided link list">
                    <h4 class="ui header">SignMaker v{{ version }}</h4>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import MailSignRenderer from './MailSignRenderer.vue'

export default {
    data () {
        return {
            visibleMessage: true,
            version: process.env.VERSION,
            isIE: /*@cc_on!@*/false || !!document.documentMode
        }
    },
    methods: {
        closeMessage () {
            this.visibleMessage = false
        }
    },
    components: {
        MailSignRenderer
    }
}
</script>

<style scoped>
.masthead.segment {
    min-height: 100px;
    padding: 1em 0em;
}
.masthead h1.ui.header {
    margin-top: 0.1em;
    margin-bottom: 0em;
    font-size: 3em;
    font-weight: normal;
}
.masthead h2 {
    font-size: 1.4em;
    font-weight: normal;
}

.notice.container {
    margin-top: 20px;
}

.footer {
    border-top: 1px solid #DDDDDD;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.08) inset;
    background-color: #fafafa;
    padding-top: 2em;
}
.footer .item {
    padding-left: 0px !important;
    border: 0 !important;
}
</style>