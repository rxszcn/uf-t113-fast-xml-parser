"use strict";

import { XMLParser, XMLValidator } from "../src/fxp.js";
import { Expression } from "path-expression-matcher";

describe("XMLParser StopNodes", function () {
  it("should support single stopNode with namespace and removeNSPrefix set", function () {
    const xmlData = `<issue><title>test 1</title><namespace:fix1><p>p 1</p><div class="show">div 1</div></namespace:fix1></issue>`;
    const expected = {
      "issue": {
        "title": "test 1",
        "fix1": "<p>p 1</p><div class=\"show\">div 1</div>"
      }
    };

    const options = {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      parseAttributeValue: true,
      removeNSPrefix: true,
      stopNodes: ["issue.fix1"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);

    // console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

    result = XMLValidator.validate(xmlData);
    expect(result).toBe(true);
  });

  it("should support single stopNode with namespace", function () {
    const xmlData = `<issue><title>test 1</title><namespace:fix1><p>p 1</p><div class="show">div 1</div></namespace:fix1></issue>`;
    const expected = {
      "issue": {
        "title": "test 1",
        "namespace:fix1": "<p>p 1</p><div class=\"show\">div 1</div>"
      }
    };

    const options = {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      parseAttributeValue: true,
      stopNodes: ["issue.namespace:fix1"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);

    // console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(expected);

    result = XMLValidator.validate(xmlData);
    expect(result).toBe(true);
  });

  it("1a. should support single stopNode", function () {
    const xmlData = `<issue><title>test 1</title><fix1><p>p 1</p><div class="show">div 1</div></fix1></issue>`;
    const expected = {
      "issue": {
        "title": "test 1",
        "fix1": "<p>p 1</p><div class=\"show\">div 1</div>"
      }
    };

    const options = {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      parseAttributeValue: true,
      stopNodes: ["issue.fix1"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);

    // console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

    result = XMLValidator.validate(xmlData);
    expect(result).toBe(true);
  });

  it("1b. 3. should support more than one stopNodes, with or without attr", function () {
    const xmlData = `<issue><title>test 1</title><fix1 lang="en"><p>p 1</p><div class="show">div 1</div></fix1><fix2><p>p 2</p><div class="show">div 2</div></fix2></issue>`;
    const expected = {
      "issue": {
        "title": "test 1",
        "fix1": {
          "#text": "<p>p 1</p><div class=\"show\">div 1</div>",
          "lang": "en"
        },
        "fix2": "<p>p 2</p><div class=\"show\">div 2</div>"
      }
    };

    const options = {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      parseAttributeValue: true,
      stopNodes: ["issue.fix1", "issue.fix2"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);

    // console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

    result = XMLValidator.validate(xmlData);
    expect(result).toBe(true);
  });

  it("1c. have two stopNodes, one within the other", function () {
    const xmlData = `<issue><title>test 1</title><fix1 lang="en"><p>p 1</p><fix2><p>p 2</p><div class="show">div 2</div></fix2><div class="show">div 1</div></fix1></issue>`;
    const expected = {
      "issue": {
        "title": "test 1",
        "fix1": {
          "#text": "<p>p 1</p><fix2><p>p 2</p><div class=\"show\">div 2</div></fix2><div class=\"show\">div 1</div>",
          "lang": "en"
        }
      }
    };

    const options = {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      parseAttributeValue: true,
      stopNodes: ["issue.fix1", "issue.fix2"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);

    //console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

    result = XMLValidator.validate(xmlData);
    expect(result).toBe(true);
  });

  it("2a. stop node has nothing in it", function () {
    const xmlData = `<issue><title>test 1</title><fix1></fix1></issue>`;
    const expected = {
      "issue": {
        "title": "test 1",
        "fix1": ""
      }
    };

    const options = {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      parseAttributeValue: true,
      stopNodes: ["issue.fix1", "issue.fix2"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);

    //console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

    result = XMLValidator.validate(xmlData);
    expect(result).toBe(true);
  });

  it("2b. stop node is self-closing", function () {
    const xmlData = `<issue><title>test 1</title><fix1/></issue>`;
    const expected = {
      "issue": {
        "title": "test 1",
        "fix1": ""
      }
    };

    const options = {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      parseAttributeValue: true,
      stopNodes: ["issue.fix1", "issue.fix2"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);

    //console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

    result = XMLValidator.validate(xmlData);
    expect(result).toBe(true);
  });

  it("5. stopNode at root level", function () {
    const xmlData = `<fix1><p>p 1</p><div class="show">div 1</div></fix1>`;
    const expected = {
      "fix1": "<p>p 1</p><div class=\"show\">div 1</div>"
    };

    const options = {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      stopNodes: ["fix1", "fix2"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);

    //console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

    result = XMLValidator.validate(xmlData, {
      allowBooleanAttributes: true
    });
    expect(result).toBe(true);
  });

  it("should skip all nodes of given name irrespective of their level", function () {
    const xmlData = `
        <root>
          <fix1>
            <p>p 1</p>
            <div class="show">div 1</div>
          </fix1>
          <another>
            <fix1>
              <nested>str</nested>
            </fix1>
          </another>
        </root>`;
    const expected = {
      "root": {
        "fix1": "\n            <p>p 1</p>\n            <div class=\"show\">div 1</div>\n          ",
        "another": {
          "fix1": "\n              <nested>str</nested>\n            "
        }
      }
    };

    const options = {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      stopNodes: ["..fix1", "fix2"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);

    //console.log(JSON.stringify(result, null, 4));
    //console.log(JSON.stringify(expected, null, 4));
    expect(result).toEqual(expected);

    result = XMLValidator.validate(xmlData, {
      allowBooleanAttributes: true
    });
    expect(result).toBe(true);
  });

  it("should call tagValueProcessor for stop Node", function () {
    const XMLdata = `
      <products capture-installed="true">
      <script/>
      <product>
      <pid>8</pid>
      <modelno>6273033</modelno>
      <name>
      <![CDATA[ Big Red Truck ]]>
      </name>
      <category>
      <![CDATA[ Toys]]>
      </category>
      <currency>USD</currency>
      <price><actualprice>19.20</actualprice></price>
    </product>
      `;

    const expected = {
      "products": {
        "script": "",
        "product": {
          "pid": "8",
          "modelno": "6273033",
          "name": " Big Red Truck ",
          "category": " Toys",
          "currency": "USD",
          "price": `<actualprice>19.20</actualprice>`
        }
      }
    };

    const options = {
      ignoreAttributes: true,
      stopNodes: [
        "products.product.price"
      ],
      tagValueProcessor: (tagName, tagValue, jPath, hasAttributes, isLeafNode) => {
        if (jPath === 'products.product.price') {
          // console.log(tagName, tagValue, jPath, hasAttributes, isLeafNode);
          return /([0-9]+\.[0-9]+)/.exec(tagValue)[1]
        }
      },
      // preserveOrder: true,
    };
    const parser = new XMLParser(options);
    let result = parser.parse(XMLdata);
    // console.log(JSON.stringify(result, null,4));

    expect(expected).toEqual(result);
  });

  it("should skip self-closing stop nodes", function () {
    const XMLdata = `<root><foo name="bar"></foo><bar name="bar"/></root>`;

    const expected = [{
      root: [
        { foo: [{ '#text': '' }] },
        { bar: [{ '#text': '' }] }
      ]
    }];

    const options = {
      // ignoreAttributes: true,
      stopNodes: ["*.foo", "*.bar"],
      preserveOrder: true,
    };
    const parser = new XMLParser(options);
    let result = parser.parse(XMLdata);
    // console.log(JSON.stringify(result, null,4));

    expect(expected).toEqual(result);
  });
  it("should skip unpaired stop nodes", function () {
    const XMLdata = `<root><foo name="bar"></foo><bar name="bar"></root>`;

    const expected = [{
      root: [
        { foo: [{ '#text': '' }] },
        { bar: [{ '#text': '' }] }
      ]
    }];

    const options = {
      // ignoreAttributes: true,
      stopNodes: ["*.foo", "*.bar"],
      unpairedTags: ["bar"],
      preserveOrder: true,
    };
    const parser = new XMLParser(options);
    let result = parser.parse(XMLdata);
    // console.log(JSON.stringify(result, null,4));

    expect(expected).toEqual(result);
  });

  it("should not incorrectly close the stop node if the same tag name appears inside", function () {
    const xmlData = `<issue><title>test 1</title><fix1><p>p 1</p><div class="show">div 1</div><other><fix1>more</fix1></other></fix1><last>something</last></issue>`;
    const expected = {
      issue: {
        title: 'test 1',
        fix1: '<p>p 1</p><div class="show">div 1</div><other><fix1>more</fix1></other>',
        last: 'something'
      },
    };

    const options = {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      parseAttributeValue: true,
      stopNodes: ["issue.fix1"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);

    // console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

    result = XMLValidator.validate(xmlData);
    expect(result).toBe(true);
  });
  it("should allow CDATA, comment or any other special tag inside", function () {
    const xmldata = `<a><b b="23"><![CDATA[']]></b><b>'</b></a>`;

    const stopNodes = [
      '*.b',
    ];

    const options = {
      stopNodes,
    };
    const expected = {
      "a": {
        "b": [
          "<![CDATA[']]>",
          "'"
        ]
      }
    };
    const parser = new XMLParser(options);
    let jObj = parser.parse(xmldata);
    // console.log(JSON.stringify(jObj,null,4));
    expect(jObj).toEqual(expected);
  });

  it("should allow self closing tag with same tag-name", function () {
    const xmldata = `<b><b /></b>`;
    const expected = {
      "b": "<b />"
    };
    const stopNodes = ['b'];

    const options = {
      stopNodes,
    };

    const parser = new XMLParser(options);
    let jObj = parser.parse(xmldata);
    // console.log(JSON.stringify(jObj, null, 4));
    expect(jObj).toEqual(expected);
  });
  it("should parse self closing stop node without attributes", function () {

    const xmlData = `<script/>`;
    const options = {
      allowBooleanAttributes: true,
      ignoreAttributes: false,
      stopNodes: ["*.pre", "*.script"],
    };
    const expected = {
      "script": ""
    }
    const parser = new XMLParser(options);
    // console.log(JSON.stringify(parser.parse(xml)));

    let result = parser.parse(xmlData);

    // console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

  });
  it("should parse attributes correctly for self closing stop node", function () {

    const xmlData = `<script src="some.js" />`;
    const options = {
      allowBooleanAttributes: true,
      ignoreAttributes: false,
      stopNodes: ["*.pre", "*.script"],
    };
    const expected = {
      "script": {
        "@_src": "some.js"
      }
    }
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);

    // console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(expected);

  });

  it("(PR #818) should parse stop node when namespace is set to be removed", function () {

    const xmlData = `<root><ns:code>safe <ns:code>nested</ns:code> still raw</ns:code></root>`;
    const options = {
      stopNodes: ["root.ns::code"],
      removeNSPrefix: true
    };

    const expected = {
      "root": {
        "code": "safe <ns:code>nested</ns:code> still raw"
      }
    }

    // const result = XMLValidator.validate(xmlData)
    const parser = new XMLParser(options);
    const result = parser.parse(xmlData);

    // console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(expected);

  });

  describe("attribute-filtered stopNodes across attribute configurations", function () {
    // Shared document: two divs distinguishable only by their class attribute,
    // plus two sections distinguishable only by a boolean attribute.
    const xmlData = `
      <root>
        <div class="code"><pre>should stop</pre></div>
        <div class="text"><pre>should NOT stop</pre></div>
        <section flagged><p>flagged section stops</p></section>
        <section><p>plain section keeps parsing</p></section>
      </root>`;

    it("matches an attribute-value filter under default config via string path", function () {
      const parser = new XMLParser({
        stopNodes: ["..div[class=code]"]
      });
      expect(parser.parse(xmlData)).toEqual({
        "root": {
          "div": [
            "<pre>should stop</pre>",
            { "pre": "should NOT stop" }
          ],
          "section": [
            { "p": "flagged section stops" },
            { "p": "plain section keeps parsing" }
          ]
        }
      });
    });

    it("matches an attribute-value filter under default config via Expression", function () {
      const parser = new XMLParser({
        stopNodes: [new Expression("..div[class=code]")]
      });
      expect(parser.parse(xmlData)).toEqual({
        "root": {
          "div": [
            "<pre>should stop</pre>",
            { "pre": "should NOT stop" }
          ],
          "section": [
            { "p": "flagged section stops" },
            { "p": "plain section keeps parsing" }
          ]
        }
      });
    });

    it("matches an attribute-presence filter under default config", function () {
      const parser = new XMLParser({
        allowBooleanAttributes: true,
        stopNodes: ["..section[flagged]"]
      });
      expect(parser.parse(xmlData)).toEqual({
        "root": {
          "div": [
            { "pre": "should stop" },
            { "pre": "should NOT stop" }
          ],
          "section": [
            "<p>flagged section stops</p>",
            { "p": "plain section keeps parsing" }
          ]
        }
      });
    });

    it("matches an exact (non deep-wildcard) attribute filter under default config", function () {
      const xml = `<root><item type="x"><a>1</a></item><item type="y"><a>2</a></item></root>`;
      const parser = new XMLParser({
        stopNodes: ["root.item[type=x]"]
      });
      expect(parser.parse(xml)).toEqual({
        "root": {
          "item": ["<a>1</a>", { "a": 2 }]
        }
      });
    });

    it("keeps the matched subtree raw when attributes are explicitly emitted", function () {
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        stopNodes: ["..div[class=code]", "..section[flagged]"]
      });
      expect(parser.parse(xmlData)).toEqual({
        "root": {
          "div": [
            { "#text": "<pre>should stop</pre>", "@_class": "code" },
            { "pre": "should NOT stop", "@_class": "text" }
          ],
          // The boolean attribute stays out of the tree unless
          // allowBooleanAttributes is enabled, but the presence filter still
          // matches, so the subtree collapses to its raw text.
          "section": [
            "<p>flagged section stops</p>",
            { "p": "plain section keeps parsing" }
          ]
        }
      });
    });

    it("emits boolean attributes alongside the raw subtree when explicitly enabled", function () {
      const parser = new XMLParser({
        ignoreAttributes: false,
        allowBooleanAttributes: true,
        attributeNamePrefix: "@_",
        stopNodes: ["..section[flagged]"]
      });
      expect(parser.parse(xmlData)).toEqual({
        "root": {
          // Non-matching nodes keep their normal parsed form, attributes included.
          "div": [
            { "pre": "should stop", "@_class": "code" },
            { "pre": "should NOT stop", "@_class": "text" }
          ],
          "section": [
            { "#text": "<p>flagged section stops</p>", "@_flagged": true },
            { "p": "plain section keeps parsing" }
          ]
        }
      });
    });

    it("produces the same stop-node decision under default and explicit attribute configs", function () {
      const stopNodes = ["..div[class=code]", "..section[flagged]"];

      const defaultResult = new XMLParser({ stopNodes }).parse(xmlData);
      const explicitResult = new XMLParser({
        ignoreAttributes: false,
        allowBooleanAttributes: true,
        stopNodes
      }).parse(xmlData);

      // A stop node keeps its raw subtree either as a bare string (attributes
      // ignored) or as an object whose #text holds that same raw string.
      const rawText = (node) => (typeof node === "string" ? node : node["#text"]);

      // The SAME nodes are selected as stop nodes under both configs...
      expect(rawText(defaultResult.root.div[0])).toBe("<pre>should stop</pre>");
      expect(rawText(explicitResult.root.div[0])).toBe("<pre>should stop</pre>");
      expect(rawText(defaultResult.root.section[0])).toBe("<p>flagged section stops</p>");
      expect(rawText(explicitResult.root.section[0])).toBe("<p>flagged section stops</p>");

      // ...and the preserved raw text is byte-identical across configs.
      expect(rawText(explicitResult.root.div[0])).toBe(rawText(defaultResult.root.div[0]));
      expect(rawText(explicitResult.root.section[0])).toBe(rawText(defaultResult.root.section[0]));

      // Non-matching subtrees keep being parsed structurally in both configs.
      expect(defaultResult.root.div[1]).toEqual({ "pre": "should NOT stop" });
      expect(explicitResult.root.div[1]["pre"]).toBe("should NOT stop");
      expect(defaultResult.root.section[1]).toEqual({ "p": "plain section keeps parsing" });
      expect(explicitResult.root.section[1]["p"]).toBe("plain section keeps parsing");

      // The explicit config additionally surfaces the matched attributes,
      // without changing the stop decision.
      expect(explicitResult.root.div[0]["@_class"]).toBe("code");
      expect(explicitResult.root.section[0]["@_flagged"]).toBe(true);
      expect(defaultResult.root.div[0]["@_class"]).toBeUndefined();
    });

    it("does not match when the attribute name or value differs, under default config", function () {
      const parser = new XMLParser({
        stopNodes: ["..div[class=missing]", "..section[absent]"]
      });
      expect(parser.parse(xmlData)).toEqual({
        "root": {
          "div": [
            { "pre": "should stop" },
            { "pre": "should NOT stop" }
          ],
          "section": [
            { "p": "flagged section stops" },
            { "p": "plain section keeps parsing" }
          ]
        }
      });
    });

    it("handles self-closing stop nodes selected by an attribute filter", function () {
      const xml = `<root><script src="a.js"/><script src="b.js">x()</script></root>`;

      const defaultParser = new XMLParser({ stopNodes: ["..script[src]"] });
      expect(defaultParser.parse(xml)).toEqual({
        "root": { "script": ["", "x()"] }
      });

      const explicitParser = new XMLParser({
        ignoreAttributes: false,
        stopNodes: ["..script[src]"]
      });
      expect(explicitParser.parse(xml)).toEqual({
        "root": {
          "script": [
            { "@_src": "a.js" },
            { "#text": "x()", "@_src": "b.js" }
          ]
        }
      });
    });

    it("works with attribute filters in preserveOrder mode under default config", function () {
      const parser = new XMLParser({
        preserveOrder: true,
        stopNodes: ["..div[class=code]"]
      });
      expect(parser.parse(xmlData)).toEqual([
        {
          "root": [
            { "div": [{ "#text": "<pre>should stop</pre>" }] },
            { "div": [{ "pre": [{ "#text": "should NOT stop" }] }] },
            { "section": [{ "p": [{ "#text": "flagged section stops" }] }] },
            { "section": [{ "p": [{ "#text": "plain section keeps parsing" }] }] }
          ]
        }
      ]);
    });

    it("does not regress plain (attribute-free) stopNodes under default config", function () {
      const parser = new XMLParser({
        stopNodes: ["..div"]
      });
      expect(parser.parse(xmlData)).toEqual({
        "root": {
          "div": [
            "<pre>should stop</pre>",
            "<pre>should NOT stop</pre>"
          ],
          "section": [
            { "p": "flagged section stops" },
            { "p": "plain section keeps parsing" }
          ]
        }
      });
    });
  });
});
