<template>
    <div>
        <div class="ui mail-sign-form container">
            <div class="ui dimmer" :class="isDimmedActive">
                <div class="content">
                    <h2 class="ui inverted icon header">
                        <i class="notched circle loading icon"></i>
                        {{ renderingText }}
                    </h2>
                </div>
            </div>
            <form class="ui form">
                <h4 class="ui dividing header">메일서명정보</h4>
                <div class="two fields">
                    <div class="field" :class="validName">
                        <label>이름</label>
                        <div class="ui corner labeled input">
                            <input type="text" placeholder="이름을 한글자씩 띄어 입력해 주세요" v-model="signInfo.name" />
                            <div class="ui corner label">
                                <i class="asterisk icon"></i>
                            </div>
                        </div>
                    </div>
                    <div class="field" :class="validDepartment">
                        <label>부서명</label>
                        <div class="ui corner labeled input">
                            <input type="text" placeholder="부서명을 입력해 주세요" v-model="signInfo.department" />
                            <div class="ui corner label">
                                <i class="asterisk icon"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="two fields">
                    <div class="field">
                        <label>홈페이지</label>
                        <input type="text" placeholder="입력하지 않을 경우 미라콤 홈페이지가 기본 입력됩니다" v-model="signInfo.homepage" />
                    </div>
                    <div class="field" :class="validPhone">
                        <label>전화번호</label>
                        <div class="ui corner labeled input">
                            <input type="text" placeholder="전화번호를 입력해 주세요" v-model="signInfo.phone" />
                            <div class="ui corner label">
                                <i class="asterisk icon"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field" :class="validEmail">
                    <label>이메일</label>
                    <div class="ui corner labeled input">
                        <input type="text" placeholder="이메일을 입력해 주세요" v-model="signInfo.email" />
                        <div class="ui corner label">
                            <i class="asterisk icon"></i>
                        </div>
                    </div>
                </div>
                <div class="field">
                    <label>서식 선택 (메일서명을 생성할 때에는 최대 5개까지만 선택해주세요)</label>
                    <div class="ui sel-template segment">
                        <div class="ui secondary vertical fluid menu">
                            <div v-for="template in templates" :key="template.id" class="item"
                                :class="isActiveTemplate(template)"
                                @click="template.active = !template.active">
                                <i v-if="template.inverted" class="circle icon" :class="template.colored"></i>
                                {{ template.name }}
                                {{ getTemplateSubName(template.colorVariation) }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fluid ui primary button" @click="createDataUrls">
                    <i class="icon address card"></i>메일서명 생성 (Image DataURL)
                </div>
            </form>
        </div>

        <div class="ui divider container"></div>

        <div class="ui mail-sign container">
            <div class="ui grid" v-for="template in activeTemplates" :key="template.id">
                <div class="six wide column">
                    <mail-sign-template
                        :refid="template.id"
                        :name="checkBlank(signInfo.name)"
                        :department="checkBlank(signInfo.department)"
                        :homepage="checkBlank(signInfo.homepage)"
                        :phone="checkBlank(signInfo.phone)"
                        :email="checkBlank(signInfo.email)"

                        :inverted="template.inverted"
                        :colored="template.colored"
                        :colorVariation="template.colorVariation"
                        :logoVariation="template.logoVariation"
                    />
                </div>
                <div class="ten wide column">
                    <div class="ui two top attached buttons">
                        <div type="button" class="ui teal button"
                            :class="isEnableButtonSet(template.id)"
                            @click="copyToClipboard(template.id)">
                            <i class="copy outline icon"></i>
                            클립보드에 복사
                        </div>
                        <div type="button" class="ui button"
                            :class="isEnableButtonSet(template.id, true)"
                            @click="signDownload(template.id, signInfo.name)">
                            <i class="download icon"></i>
                            파일 다운로드
                        </div>
                    </div>
                    <div class="ui attached segment result-box">
                        <div class="ui dimmer" :resultid="template.id">
                            <div class="content">
                                <h2 class="ui inverted icon header">
                                    <i class="check icon"></i>
                                    Copied!
                                </h2>
                            </div>
                        </div>
                        <form class="ui form">
                            <div class="field">
                                <textarea :id="template.id" readonly></textarea>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'
import lodash from 'lodash'
import moment from 'moment'

import MailSignTemplate from './MailSignTemplate.vue'
import { templates } from '../models/TemplateModel'

export default {
    data () {
        return {
            canvas: {},
            signInfo: {
                name: undefined,
                deaprtment: undefined,
                homepage: undefined,
                phone: undefined,
                email: undefined
            },
            valid: {
                name: false,
                department: false,
                phone: false,
                email: false,
            },
            templates,
            isRendering: false,
            renderingText: 'Prepare Rendering...',
            isIE: /*@cc_on!@*/false || !!document.documentMode
        }
    },
    computed: {
        isDimmedActive () {
            return this.isRendering ? 'active' : ''
        },
        activeTemplates () {
            return this.templates.filter(template => template.active)
        },
        isIENotReadyStyle () {
            return this.isIE ? 'disabled' : ''
        },
        validName () {
            return this.valid.name ? 'error' : ''
        },
        validDepartment () {
            return this.valid.department ? 'error' : ''
        },
        validPhone () {
            return this.valid.phone ? 'error' : ''
        },
        validEmail () {
            return this.valid.email ? 'error' : ''
        }
    },
    methods: {
        checkBlank: (str) => lodash.isEmpty(str) ? undefined : str,
        isEnableButtonSet (id, checkIE = false) {
            if (checkIE) return (this.isIE) ? 'disabled' : (this.canvas[id] === undefined) ? 'disabled' : ''
            else return (this.canvas[id] === undefined) ? 'disabled' : ''
        },
        validateForm () {
            this.valid.name = lodash.isEmpty(this.signInfo.name)
            this.valid.department = lodash.isEmpty(this.signInfo.department)
            this.valid.phone = lodash.isEmpty(this.signInfo.phone)
            this.valid.email = lodash.isEmpty(this.signInfo.email)

            return this.valid.name || this.valid.department || this.valid.phone || this.valid.email
        },
        async createDataUrls () {
            if (this.validateForm()) return;

            if (this.activeTemplates.length > 5) {
                alert('렌더링 서식 선택은 5개 이하로 선택해 주세요')
                return;
            }

            if (this.activeTemplates.length === 0) {
                alert('렌더링 서식을 1개 이상 선택해주세요')
                return;
            }

            await this.prepareRender(true)
            let selectedTemplates = this.templates.reduce((acc, cur) => {
                if (cur.active) acc.push(cur.id)
                return acc
            }, [])

            for (let id of selectedTemplates) {
                const targetEle = document.querySelector(`[refid=${id}]`)
                let width = targetEle.offsetWidth + 10
                let height = targetEle.offsetHeight

                this.renderingText = `${this.getTemplateText(id)} Rendering...`
                let canvas = await html2canvas(targetEle, { width, height })
                this.canvas[id] = canvas
                document.querySelector(`textarea#${id}`).innerText = `<img src="${canvas.toDataURL("image/png")}" />`
            }

            document.body.style.overflow = 'auto'
            this.isRendering = false
            this.renderingText = 'Prepare Rendering...'
        },
        prepareRender (isDelay = false) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.canvas = {}
                    window.scrollTo(0, 0)
                    document.body.style.overflow = 'hidden'
                    this.isRendering = true
                    resolve()
                }, isDelay ? 500 : 0)
            })
        },
        copyToClipboard (id) {
            document.querySelector(`#${id}`).select()
            document.execCommand('copy')

            const dimmer = document.querySelector(`.dimmer[resultid=${id}]`)
            dimmer.classList.add('active')
            setTimeout(() => {
                dimmer.classList.remove('active')
            }, 2000)
        },
        signDownload (id, name = '홍길동') {
            if (this.canvas[id].toBlob) {
                this.canvas[id].toBlob(blob => 
                    saveAs(blob, `${name.trim().replace(/ /g, '')}_메일서명_${moment().format('YYYYMMDDHHmmss')}.png`))
            } else {
                this.canvas[id].msToBlob(blob => 
                    saveAs(blob, `${name.trim().replace(/ /g, '')}_메일서명_${moment().format('YYYYMMDDHHmmss')}.png`))
            }
        },
        getTemplateText (id) {
            let template = this.templates.filter(template => template.id === id)[0]
            let templateText = template.name
            if (!lodash.isEmpty(template.colorVariation))
                templateText += ` (${template.colorVariation})`
            return templateText
        },
        getTemplateSubName: (subName) => !lodash.isEmpty(subName) ? `(${lodash.upperFirst(subName)})` : '',
        isActiveTemplate: (template) => template.active ? 'active' : ''
    },
    components: {
        MailSignTemplate
    }
}
</script>

<style scoped>
.mail-sign.container, .mail-sign-form.container {
    margin-top: 30px;
}
.result-box textarea {
    height: 139px !important;
}
.sel-template.segment {
    height: 150px;
    overflow-y: auto;
}
.sel-template .menu .item {
    cursor: pointer;
}
.dimmer {
    overflow: hidden;
}
</style>