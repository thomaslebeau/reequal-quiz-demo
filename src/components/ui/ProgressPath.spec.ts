import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ProgressPath from './ProgressPath.vue'

const vuetify = createVuetify({ components, directives })

function mountPath (
  total = 5,
  current = 0,
): VueWrapper {
  return mount(ProgressPath, {
    props: { total, current },
    global: { plugins: [vuetify] },
  })
}

describe('ProgressPath', () => {
  describe('nodes', () => {
    it('should render a node for each step', () => {
      const wrapper = mountPath(4, 0)

      const nodes = wrapper.findAll('[data-testid^="step-node-"]')
      expect(nodes).toHaveLength(4)
    })

    it('should display the step number in each node', () => {
      const wrapper = mountPath(3, 0)

      expect(wrapper.find('[data-testid="step-node-0"]').text()).toContain('1')
      expect(wrapper.find('[data-testid="step-node-1"]').text()).toContain('2')
      expect(wrapper.find('[data-testid="step-node-2"]').text()).toContain('3')
    })

    it('should mark completed steps with primary color', () => {
      const wrapper = mountPath(4, 2)

      const step0 = wrapper.find('[data-testid="step-node-0"]')
      const step1 = wrapper.find('[data-testid="step-node-1"]')

      expect(step0.classes().some(c => c.includes('bg-primary'))).toBe(true)
      expect(step1.classes().some(c => c.includes('bg-primary'))).toBe(true)
    })

    it('should mark the current step with secondary color', () => {
      const wrapper = mountPath(4, 2)

      const currentStep = wrapper.find('[data-testid="step-node-2"]')
      expect(currentStep.classes().some(c => c.includes('bg-secondary'))).toBe(true)
    })

    it('should mark upcoming steps with grey color', () => {
      const wrapper = mountPath(4, 1)

      const upcoming = wrapper.find('[data-testid="step-node-2"]')
      expect(upcoming.classes().some(c => c.includes('bg-grey'))).toBe(true)
    })

    it('should show a check icon on completed steps', () => {
      const wrapper = mountPath(3, 2)

      const completedNode = wrapper.find('[data-testid="step-node-0"]')
      expect(completedNode.find('.mdi-check').exists()).toBe(true)
    })
  })

  describe('progress line', () => {
    it('should render a v-progress-linear element', () => {
      const wrapper = mountPath(5, 0)

      expect(wrapper.find('.v-progress-linear').exists()).toBe(true)
    })

    it('should set progress-linear value based on current step', () => {
      const wrapper = mountPath(4, 2)

      const bar = wrapper.find('.v-progress-linear')
      expect(bar.attributes('aria-valuenow')).toBe('50')
    })

    it('should have 0% at the start', () => {
      const wrapper = mountPath(5, 0)

      const bar = wrapper.find('.v-progress-linear')
      expect(bar.attributes('aria-valuenow')).toBe('0')
    })

    it('should have 100% when on the last step', () => {
      const wrapper = mountPath(3, 3)

      const bar = wrapper.find('.v-progress-linear')
      expect(bar.attributes('aria-valuenow')).toBe('100')
    })
  })

  describe('edge cases', () => {
    it('should handle a single step quiz', () => {
      const wrapper = mountPath(1, 0)

      const nodes = wrapper.findAll('[data-testid^="step-node-"]')
      expect(nodes).toHaveLength(1)
      expect(nodes[0]!.classes().some(c => c.includes('bg-secondary'))).toBe(true)
    })
  })
})
