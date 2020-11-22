import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import Puppeteer from './Puppeteer';
import puppet from './Puppet.hoc';

describe('Puppeteer', () => {
    it('should override the puppet\'s props', () => {
        const Container = ({children, value}) => (
            <Puppeteer props={{
                value: props => value + props.value,
            }}>{children}</Puppeteer>
        );
        const Puppet = puppet()(({value}) => <div>{value}</div>);
        const wrapper = mount(<Container value='foo'><Puppet value='bar'/></Container>);

        expect(wrapper.find('Puppeteer')).to.have.length(1);
        expect(wrapper.find('puppet()')).to.have.length(1);
        expect(wrapper.find('div').text()).to.eql('foobar');
    });
    it('should override the puppet\'s props based on namespace', () => {
        const Container = ({children, value}) => (
            <Puppeteer namespace='a' props={{
                value: props => value + props.value,
            }}>{children}</Puppeteer>
        );
        const PuppetA = puppet('a')(({value}) => <div className='a'>{value}</div>);
        const PuppetB = puppet('b')(({value}) => <div className='b'>{value}</div>);
        const wrapper = mount(
            <Container value='foo'>
                <PuppetA value='bar'/>
                <PuppetB value='bar'/>
            </Container>
        );

        expect(wrapper.find('Puppeteer')).to.have.length(1);
        expect(wrapper.find('puppet()')).to.have.length(2);
        expect(wrapper.find('.a').text()).to.eql('foobar');
        expect(wrapper.find('.b').text()).to.eql('bar');
    });
    it('should override the puppet\'s props for global namespace', () => {
        const Container = ({children, value}) => (
            <Puppeteer props={{
                value: props => value + props.value,
            }}>{children}</Puppeteer>
        );
        const Puppet = puppet('mock')(({value}) => <div>{value}</div>);
        const wrapper = mount(<Container value='foo'><Puppet value='bar'/></Container>);

        expect(wrapper.find('Puppeteer')).to.have.length(1);
        expect(wrapper.find('puppet()')).to.have.length(1);
        expect(wrapper.find('div').text()).to.eql('foobar');
    });
    it('should break the overriding of the puppet\'s props', () => {
        const Container = ({children, value}) => (
            <Puppeteer props={{
                value: props => value + props.value,
            }}>{children}</Puppeteer>
        );
        const Puppet = puppet()(({value}) => <div>{value}</div>);
        const wrapper = mount(
            <Container value='foo'>
                <Puppeteer.Break props={['value']}>
                    <Puppet value='bar'/>
                </Puppeteer.Break>
            </Container>
        );

        expect(wrapper.find('Puppeteer')).to.have.length(1);
        expect(wrapper.find('puppet()')).to.have.length(1);
        expect(wrapper.find('div').text()).to.eql('bar');

        // Should break overriding of all the props when no props are provided
        wrapper.setProps({children: (
            <Puppeteer.Break>
                <Puppet value='bar'/>
            </Puppeteer.Break>
        )});
        wrapper.update();
        expect(wrapper.find('div').text()).to.eql('bar');
    });
});
